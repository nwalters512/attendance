const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  res.locals.courseInstanceId = req.params.courseInstanceId
  sqlDb.query(
    sql.select_course_instances,
    { instId: req.params.courseInstanceId },
    (err, result) => {
      if (ERR(err, next)) return
      if (result.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }
      const instRow = result.rows[0]
      res.locals.instTerm = instRow.term
      res.locals.instName = instRow.name
      res.locals.instYear = instRow.year
      sqlDb.query(
        sql.select_sections,
        {
          ciTerm: instRow.term,
          ciName: instRow.name,
          ciYear: instRow.year,
        },
        (errSec, resultSec) => {
          if (ERR(errSec, next)) return
          res.locals.sections = resultSec.rows
          sqlDb.query(
            sql.select_meetings,
            {
              ciTerm: instRow.term,
              ciName: instRow.name,
              ciYear: instRow.year,
            },
            (errMeet, resultMeet) => {
              if (ERR(errMeet, next)) return
              res.locals.meetings = resultMeet.rows
              res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
            }
          )
        }
      )
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
          res.redirect(req.originalUrl)
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
          res.redirect(req.originalUrl)
        })
      }
    )
  } else {
    res.redirect(req.originalUrl)
  }
})

module.exports = router
