const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  res.locals.meetingId = req.params.meetingId
  sqlDb.query(
    sql.select_meetings,
    { meetingId: req.params.meetingId },
    (err, result) => {
      if (ERR(err, next)) return
      if (result.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }
      const meetingRow = result.rows[0]
      sqlDb.query(
        sql.select_section_meetings,
        {
          ciTerm: meetingRow.ci_term,
          ciName: meetingRow.ci_name,
          ciYear: meetingRow.ci_year,
          name: meetingRow.name,
        },
        (errMeeting, resultMeeting) => {
          if (ERR(errMeeting, next)) return
          res.locals.meetingName = meetingRow.name
          res.locals.section_meetings = resultMeeting.rows
          res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
        }
      )
    }
  )
})

module.exports = router
