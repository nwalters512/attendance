const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
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
    if (req.body.__action === 'newSwipe') {
      const params = {
        UIN: Number.parseInt(req.body.UIN, 10),
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
      await dbDriver.asyncQuery(sql.insert_swipes, params)
    }
  })
)

module.exports = router
