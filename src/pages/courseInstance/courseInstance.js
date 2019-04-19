const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const fileUpload = require('express-fileupload')
const { sqlLoader } = require('@prairielearn/prairielib')
const {
  FOREIGN_KEY_VIOLATION,
  UNIQUE_VIOLATION,
} = require('pg-error-constants')
const csvParse = require('csv-parse/lib/sync')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

// Used to sanitize UTF-8 strings and remove BOM from UTF-8 CSV encodings
const utf8Re = /(?![\x20-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g

const rosterCsvHeadingMap = {
  'Net ID': 'netid',
  'Admit Term': 'admitTerm',
  'Last Name': 'lastName',
  'First Name': 'firstName',
  'Preferred Name': 'preferredName',
  'Email Address': 'emailAddress',
  'Major 1 Name': 'majorName',
}

router.use(
  fileUpload({
    safeFileNames: true,
  })
)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }
    if (
      !(await checks.staffHasPermissionsForCourseInstance(
        req,
        req.params.courseInstanceId
      ))
    ) {
      res.sendStatus(403)
      return
    }
    res.locals.courseInstanceId = req.params.courseInstanceId

    const resultSec = await dbDriver.asyncQuery(
      sql.select_sections_join_course_instances,
      { instId: req.params.courseInstanceId }
    )

    if (resultSec.rows.length === 0) {
      ERR(
        new Error(
          'Zero rows from query: select_sections_join_course_instances'
        ),
        next
      )
      return
    }

    const instRow = resultSec.rows[0]
    res.locals.instTerm = instRow.ci_term
    res.locals.instName = instRow.ci_name
    res.locals.instYear = instRow.ci_year
    res.locals.sections = resultSec.rows.filter(r => r.name)

    const params = {
      ciYear: instRow.ci_year,
      ciName: instRow.ci_name,
      ciTerm: instRow.ci_term,
    }

    res.locals.courseStaff = (await dbDriver.asyncQuery(
      sql.select_staff,
      params
    )).rows

    const resultMeet = await dbDriver.asyncQuery(
      sql.select_meetings_join_course_instances,
      { instId: req.params.courseInstanceId }
    )

    res.locals.meetings = resultMeet.rows.filter(r => r.name)
    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!checks.isLoggedIn(req)) {
      res.sendStatus(403)
      return
    }
    if (
      !(await checks.staffHasPermissionsForCourseInstance(
        req,
        req.params.courseInstanceId
      ))
    ) {
      res.sendStatus(403)
      return
    }
    if (req.body.__action === 'newSection') {
      const params = {
        name: req.body.name,
        CRN: Number.parseInt(req.body.CRN, 10),
        ciTerm: req.body.courseInstanceTerm,
        ciName: req.body.courseInstanceName,
        ciYear: Number.parseInt(req.body.courseInstanceYear, 10),
      }
      if (Number.isNaN(params.CRN)) {
        ERR(new Error(`Invalid CRN: ${req.body.CRN}`), next)
        return
      }
      if (Number.isNaN(params.ciYear)) {
        ERR(new Error(`Invalid year: ${req.body.courseInstanceYear}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_sections, params)
      await dbDriver.asyncQuery(sql.insert_sections_sm, params)
    } else if (req.body.__action === 'newMeeting') {
      const params = {
        name: req.body.name,
        ciTerm: req.body.courseInstanceTerm,
        ciName: req.body.courseInstanceName,
        ciYear: Number.parseInt(req.body.courseInstanceYear, 10),
      }
      if (Number.isNaN(params.ciYear)) {
        ERR(new Error(`Invalid year: ${req.body.courseInstanceYear}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_meetings, params)
      await dbDriver.asyncQuery(sql.insert_meetings_sm, params)
    } else if (req.body.__action === 'uploadRoster') {
      if (Object.keys(req.files).length === 0) {
        req.flash('error', 'No files uploaded!')
        res.redirect(req.originalUrl)
        return
      }
      const { rosterFile } = req.files
      if (rosterFile === null || rosterFile === undefined) {
        ERR("Failed to receive 'rosterFile' in POST request!", next)
        return
      }
      if (rosterFile.data === null || rosterFile.data === undefined) {
        ERR(
          new Error(
            "Internal Error: 'rosterFile' has an invalid or non-existent 'data' attribute!"
          ),
          next
        )
        return
      }
      const rosterCSVString = new TextDecoder()
        .decode(rosterFile.data)
        .replace(utf8Re, '')
      const rosterData = csvParse(rosterCSVString, {
        columns: true,
        skip_empty_lines: true,
        encoding: 'UTF-8',
      })
      const params = {
        ciTerm: [],
        ciName: [],
        ciYear: [],
      }
      rosterData.forEach(entry => {
        Object.keys(entry).forEach(key => {
          if (params[key] === undefined || params[key] === null) {
            params[key] = [entry[key]]
          } else {
            params[key].push(entry[key])
          }
        })
        params.ciTerm.push(req.body.courseInstanceTerm)
        params.ciName.push(req.body.courseInstanceName)
        params.ciYear.push(req.body.courseInstanceYear)
      })
      if (params.ciName.length === 0) {
        req.flash(
          'error',
          'Roster file uploaded does not seem to have any entries'
        )
        req.redirect(req.originalUrl)
        return
      }
      Object.keys(rosterCsvHeadingMap).forEach(heading => {
        Object.defineProperty(
          params,
          rosterCsvHeadingMap[heading],
          Object.getOwnPropertyDescriptor(params, heading)
        )
        delete params[heading]
      })
      await dbDriver.asyncQuery(sql.insert_update_roster, params)
      req.flash('info', 'Successfully uploaded student roster data')
    } else if (req.body.__action === 'addStaff') {
      if (
        !(await checks.staffHasPermissionsForCourseInstance(
          req,
          req.params.courseInstanceId
        ))
      ) {
        req.flash('error', 'Must be on staff to add staff')
        res.redirect(req.originalUrl)
        return
      }

      const params = {
        email: req.body.email.trim(),
        ciTerm: req.body.courseInstanceTerm,
        ciYear: req.body.courseInstanceYear,
        ciName: req.body.courseInstanceName,
      }

      let results
      try {
        results = await dbDriver.asyncQuery(sql.add_staff, params)
      } catch (e) {
        if (e.code && e.code === UNIQUE_VIOLATION) {
          req.flash('error', 'Cannot add duplicate staff member')
        } else if (e.code && e.code === FOREIGN_KEY_VIOLATION) {
          req.flash('error', 'User does not exist')
        } else {
          ERR(new Error(`Error adding staff: ${e}`), next)
        }
        res.redirect(req.originalUrl)
        return
      }

      if (results.rowCount === 1) {
        req.flash('info', `Added ${req.body.email.trim()} to staff`)
      } else {
        req.flash('error', `Could not add ${req.body.email.trim()} to staff`)
      }
    } else if (req.body.__action === 'removeStaff') {
      if (
        !(await checks.staffHasPermissionsForCourseInstance(
          req,
          req.params.courseInstanceId
        ))
      ) {
        req.flash('error', 'Must be on staff to remove staff')
        res.redirect(req.originalUrl)
        return
      }

      if (req.user.email === req.body.email.trim()) {
        req.flash('error', 'Cannot remove yourself as staff!')
        res.redirect(req.originalUrl)
        return
      }

      const cName = (await dbDriver.asyncQuery(sql.select_course_instances, {
        instId: req.params.courseInstanceId,
      })).rows[0].course_name

      if (
        await checks.staffIsOwnerOfCourseByName(
          { user: { email: req.body.email.trim() } },
          cName
        )
      ) {
        req.flash('error', 'Cannot remove a course owner from staff')
        res.redirect(req.originalUrl)
        return
      }

      const params = {
        email: req.body.email.trim(),
        ciTerm: req.body.courseInstanceTerm,
        ciYear: req.body.courseInstanceYear,
        ciName: req.body.courseInstanceName,
      }

      const results = await dbDriver.asyncQuery(sql.remove_staff, params)

      if (results.rowCount === 1) {
        req.flash('info', `Removed ${req.body.email.trim()}`)
      } else {
        ERR(
          new Error(
            `Did not get 1 row on remove_staff. Got: ${results.rowCount}`
          ),
          next
        )
      }
    }

    res.redirect(req.originalUrl)
  })
)

module.exports = router
