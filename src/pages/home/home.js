const ERR = require('async-stacktrace')
const router = require('express').Router()
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    const result = await dbDriver.asyncQuery(sql.select_courses, {})
    res.locals.courses = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (req.body.__action === 'newCourse') {
      const params = {
        name: req.body.name,
        dept: req.body.dept,
        number: Number.parseInt(req.body.number, 10),
      }
      if (Number.isNaN(params.number)) {
        ERR(new Error(`Invalid course number: ${req.body.number}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_course, params)
      res.redirect(req.originalUrl)
    } else if (req.body.__action === 'deleteCourse') {
      const params = {
        id: req.body.id,
      }
      await dbDriver.asyncQuery(sql.delete_course, params)
      res.redirect(req.redirect)
    } else {
      res.redirect(req.originalUrl)
    }
  })
)

module.exports = router
