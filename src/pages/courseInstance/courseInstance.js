const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

// MODED CODE BELOW
router.get('/', (req, res, next) => {
  res.locals.courseInstanceId = req.params.courseInstanceId
  // TODO: BROKEN - Sequential queriess require async
  sqlDb.query(
    sql.select_sections_join_course_instances,
    { instId: req.params.courseInstanceId },

    (errSec, resultSec) => {
      if (ERR(errSec, next)) return
      if (resultSec.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }

      const instRow = resultSec.rows[0]
      res.locals.instTerm = instRow.term
      res.locals.instName = instRow.name
      res.locals.instYear = instRow.year
      res.locals.sections = resultSec.rows
    }
  )

  sqlDb.query(
    sql.select_meetings_join_course_instances,
    { instId: req.params.courseInstanceId },

    (errMeet, resultMeet) => {
      if (ERR(errMeet, next)) return
      if (resultMeet.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }

      res.locals.meetings = resultMeet.rows
      res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
    }
  )
})

router.post('/', (req, res, next) => {
  if (req.body.__action === 'newSection') {
    sqlDb.query(
      sql.select_course_instances,
      { instId: req.body.courseInstanceId },
      (err, result) => {
        if (ERR(err, next)) return
        if (result.rows.length === 0) {
          res.redirect(req.originalUrl)
          return
        }
        const instRow = result.rows[0]
        const params = {
          name: req.body.name,
          CRN: Number.parseInt(req.body.CRN, 10),
          ciTerm: instRow.term,
          ciName: instRow.name,
          ciYear: Number.parseInt(instRow.year, 10),
        }
        if (Number.isNaN(params.CRN)) {
          next(new Error(`Invalid CRN: ${req.body.CRN}`))
          return
        }
        if (Number.isNaN(params.ciYear)) {
          next(new Error(`Invalid year: ${instRow.year}`))
          return
        }
        sqlDb.query(sql.insert_sections, params, errIns => {
          if (ERR(errIns, next)) return
          sqlDb.query(sql.insert_sections_sm, params, errSm => {
            if (ERR(errSm, next)) return
            res.redirect(req.originalUrl)
          })
        })
      }
    )
  } else if (req.body.__action === 'newMeeting') {
    sqlDb.query(
      sql.select_course_instances,
      { instId: req.body.courseInstanceId },
      (err, result) => {
        if (ERR(err, next)) return
        if (result.rows.length === 0) {
          res.redirect(req.originalUrl)
          return
        }
        const instRow = result.rows[0]
        const params = {
          name: req.body.name,
          ciTerm: instRow.term,
          ciName: instRow.name,
          ciYear: Number.parseInt(instRow.year, 10),
        }
        if (Number.isNaN(params.ciYear)) {
          next(new Error(`Invalid year: ${instRow.year}`))
          return
        }
        sqlDb.query(sql.insert_meetings, params, errIns => {
          if (ERR(errIns, next)) return
          sqlDb.query(sql.insert_meetings_sm, params, errSm => {
            if (ERR(errSm, next)) return
            res.redirect(req.originalUrl)
          })
        })
      }
    )
  } else {
    res.redirect(req.originalUrl)
  }
})

module.exports = router
