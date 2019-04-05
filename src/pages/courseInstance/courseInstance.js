const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
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
    res.locals.sections = resultSec.rows

    const resultMeet = await dbDriver.asyncQuery(
      sql.select_meetings_join_course_instances,
      { instId: req.params.courseInstanceId }
    )

    res.locals.meetings = resultMeet.rows
    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
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
    }
    res.redirect(req.originalUrl)
  })
)

module.exports = router
