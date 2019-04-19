const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const fileUpload = require('express-fileupload')
const { sqlLoader } = require('@prairielearn/prairielib')
const csvParse = require('csv-parse/lib/sync')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

// Used to sanitize UTF-8 strings and remove BOM from UTF-8 CSV encodings
const utf8Re = /(?![\x20-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g

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
    res.locals.sectionId = req.params.sectionId
    const result = await dbDriver.asyncQuery(
      sql.select_section_meetings_join_sections,
      { sectionId: req.params.sectionId }
    )
    if (result.rows.length === 0) {
      ERR(
        new Error(
          'Zero rows from query: select_section_meetings_join_sections'
        ),
        next
      )
      return
    }

    const secRow = result.rows[0]
    res.locals.sectionName = secRow.name
    res.locals.instTerm = secRow.ci_term
    res.locals.instName = secRow.ci_name
    res.locals.instYear = secRow.ci_year
    res.locals.section_meetings = result.rows.filter(r => r.m_name && r.s_name)
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (req.body.__action === 'uploadEnrollment') {
      if (Object.keys(req.files).length === 0) {
        req.flash('error', 'No files uploaded!')
        res.redirect(req.originalUrl)
        return
      }
      const { enrollmentFile } = req.files
      if (enrollmentFile === null || enrollmentFile === undefined) {
        ERR("Failed to receive 'enrollmentFile' in POST request!", next)
        return
      }
      if (enrollmentFile.data === null || enrollmentFile.data === undefined) {
        ERR(
          new Error(
            "Internal Error: 'enrollmentFile' has an invalid or non-existent 'data' attribute!"
          ),
          next
        )
        return
      }
      const enrollmentCSVString = new TextDecoder()
        .decode(enrollmentFile.data)
        .replace(utf8Re, '')
      const enrollmentData = csvParse(enrollmentCSVString, {
        columns: true,
        skip_empty_lines: true,
        encoding: 'UTF-8',
      })
      const params = {
        secName: [],
        ciTerm: [],
        ciName: [],
        ciYear: [],
      }
      enrollmentData.forEach(entry => {
        Object.keys(entry).forEach(key => {
          if (params[key] === undefined || params[key] === null) {
            params[key] = [entry[key]]
          } else {
            params[key].push(entry[key])
          }
        })
        params.secName.push(req.body.sectionName)
        params.ciTerm.push(req.body.courseInstanceTerm)
        params.ciName.push(req.body.courseInstanceName)
        params.ciYear.push(req.body.courseInstanceYear)
      })
      if (params.ciName.length === 0) {
        req.flash(
          'error',
          'Enrollment file uploaded does not seem to have any entries'
        )
        req.redirect(req.originalUrl)
        return
      }
      const sectionParams = {
        secName: req.body.sectionName,
        ciTerm: req.body.courseInstanceTerm,
        ciName: req.body.courseInstanceName,
        ciYear: req.body.courseInstanceYear,
      }
      await dbDriver.asyncQuery(sql.delete_section_enrollment, sectionParams)
      await dbDriver.asyncQuery(sql.insert_student_is_in_section, params)
      req.flash('info', 'Successfully uploaded section enrollment data')
    }

    res.redirect(req.originalUrl)
  })
)

module.exports = router
