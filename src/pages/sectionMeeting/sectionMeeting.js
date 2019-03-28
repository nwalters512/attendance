const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  res.locals.sectionMeetingId = req.params.sectionMeetingId
  sqlDb.query(
    sql.select_section_meetings,
    { sectionMeetingId: req.params.sectionMeetingId },
    (err, result) => {
      if (ERR(err, next)) return
      if (result.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }
      const secMeetingRow = result.rows[0]
      sqlDb.query(
        sql.select_swipes,
        {
          mname: secMeetingRow.m_name,
          sname: secMeetingRow.s_name,
        },
        (errSM, resultSM) => {
          if (ERR(errSM, next)) return
          res.locals.sectionName = secMeetingRow.s_name
          res.locals.meetingName = secMeetingRow.m_name
          res.locals.swipes = resultSM.rows
          res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
        }
      )
    }
  )
})

router.post('/', (req, res, next) => {
  if (req.body.__action === 'newSwipe') {
    sqlDb.query(
      sql.select_section_meetings,
      { sectionMeetingId: req.body.sectionMeetingId },
      (err, result) => {
        if (ERR(err, next)) return
        if (result.rows.length === 0) {
          res.redirect(req.originalUrl)
          return
        }
        const secMeetingRow = result.rows[0]
        const params = {
          UIN: Number.parseInt(req.body.UIN, 10),
          ciTerm: secMeetingRow.s_ci_term,
          ciName: secMeetingRow.s_ci_name,
          ciYear: Number.parseInt(secMeetingRow.s_ci_year, 10),
          mname: secMeetingRow.m_name,
          sname: secMeetingRow.s_name,
        }
        if (Number.isNaN(params.UIN)) {
          next(new Error(`Invalid UIN: ${req.body.UIN}`))
          return
        }
        if (Number.isNaN(params.ciYear)) {
          next(new Error(`Invalid year: ${secMeetingRow.s_ci_year}`))
          return
        }
        sqlDb.query(sql.insert_students, params, errIns => {
          if (ERR(errIns, next)) return
          sqlDb.query(sql.insert_swipes, params, errSm => {
            if (ERR(errSm, next)) return
            res.redirect(req.originalUrl)
          })
        })
      }
    )
  }
})

module.exports = router
