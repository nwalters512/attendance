const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    res.locals.meetingId = req.params.meetingId
    const result = await dbDriver.asyncQuery(
      sql.select_section_meetings_join_meetings,
      { meetingId: req.params.meetingId }
    )
    if (result.rows.length === 0) {
      ERR(
        new Error(
          'Zero rows from query: select_section_meetings_join_meetings'
        ),
        next
      )
      return
    }
    const meetingRow = result.rows[0]
    res.locals.meetingName = meetingRow.name
    res.locals.section_meetings = result.rows.filter(r => r.m_name && r.s_name)
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

module.exports = router
