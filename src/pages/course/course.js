const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    res.locals.courseId = req.params.courseId
    const result = await dbDriver.asyncQuery(
      sql.select_course_join_course_instance,
      { courseId: req.params.courseId }
    )
    if (result.rows.length === 0) {
      next(
        new Error('Zero rows from query: select_course_join_course_instance')
      )
      return
    }
    const courseRow = result.rows[0]
    res.locals.courseDept = courseRow.dept
    res.locals.courseNumber = courseRow.number
    res.locals.courseName = courseRow.name
    res.locals.course_instances = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (req.body.__action === 'newCourseInstance') {
      const params = {
        term: req.body.term,
        name: req.body.name,
        year: Number.parseInt(req.body.year, 10),
        course_name: req.body.courseName,
      }
      if (Number.isNaN(params.year)) {
        ERR(new Error(`Invalid year: ${req.body.year}`), next)
        return
      }
      await dbDriver.asyncQuery(sql.insert_course_instance, params)
      res.redirect(req.originalUrl)
    }
  })
)

module.exports = router
