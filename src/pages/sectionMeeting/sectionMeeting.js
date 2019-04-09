const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const { UNIQUE_VIOLATION } = require('pg-error-constants')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

// borrowed from https://github.com/illinois/attendance/blob/master/parse-swipe.js
const extractUIN = swipeData => {
  const re = /(?:6397(6\d{8})\d{3}|(^6\d{8}$))/
  const result = re.exec(swipeData)

  // result === null: invalid data
  // result[1]: got UIN from (string containing) 16-digit card number
  // result[2]: got UIN from raw UIN
  return result ? result[1] || result[2] : null
}

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!await checks.isLoggedIn(req)) {
      res.redirect('/login') // TODO: redirect back after login
        return
    }
    res.locals.sectionMeetingId = req.params.sectionMeetingId
    const result = await dbDriver.asyncQuery(
      sql.select_swipes_join_section_meetings,
      { sectionMeetingId: req.params.sectionMeetingId }
    )
    if (result.rows.length === 0) {
      ERR(
        new Error('Zero rows from query: select_swipes_join_section_meetings'),
        next
      )
      return
    }

    const secMeetingRow = result.rows[0]
    res.locals.sectionName = secMeetingRow.s_name
    res.locals.meetingName = secMeetingRow.m_name
    res.locals.ciTerm = secMeetingRow.s_ci_term
    res.locals.ciName = secMeetingRow.s_ci_name
    res.locals.ciYear = secMeetingRow.s_ci_year
    res.locals.swipes = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!await checks.isLoggedIn(req)) {
      res.sendStatus(403)
        return
    }
    if (req.body.__action === 'newSwipe') {
      let uin = req.body.UIN.trim()

      // attempt to match by netid if it does not start with a number
      if (uin.length > 0 && Number.isNaN(parseInt(uin[0], 10))) {
        const params = {
          netid: uin,
          ciTerm: req.body.ciTerm,
          ciName: req.body.ciName,
          ciYear: Number.parseInt(req.body.ciYear, 10),
        }

        const results = await dbDriver.asyncQuery(
          sql.find_matching_student,
          params
        )
        if (results.rows.length > 0) {
          const stuRow = results.rows[0]
          uin = stuRow
        } else {
          ERR(new Error(`Invalid netid: ${req.body.UIN}`), next)
          return
        }
      } else {
        // otherwise, assume it's a swipe/raw UIN
        uin = extractUIN(req.body.UIN)
      }
      if (uin === null) {
        ERR(new Error(`Invalid UIN: ${req.body.UIN}`), next)
        return
      }
      uin = Number.parseInt(uin, 10)

      const params = {
        UIN: uin,
        ciTerm: req.body.ciTerm,
        ciName: req.body.ciName,
        ciYear: Number.parseInt(req.body.ciYear, 10),
        mname: req.body.meetingName,
        sname: req.body.sectionName,
      }
      if (Number.isNaN(params.UIN)) {
        ERR(new Error(`Invalid UIN: ${req.body.UIN}`), next)
        return
      }
      if (Number.isNaN(params.ciYear)) {
        ERR(new Error(`Invalid year: ${req.body.ciYear}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_students, params)

      try {
        await dbDriver.asyncQuery(sql.insert_swipes, params)
      } catch (e) {
        if (e.code && e.code === UNIQUE_VIOLATION) {
          // TODO: some nice UI which says it's a duplicate swipe
          ERR(new Error('Duplicate swipe!'))
        }
      }
    }
    res.redirect(req.originalUrl)
  })
)

module.exports = router
