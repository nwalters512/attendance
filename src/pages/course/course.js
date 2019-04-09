const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!await checks.isLoggedIn(req)) {
      res.redirect('/login') // TODO: redirect back after login
        return
    }

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
          res.locals.courseName = courseRow.course_name
      if (result.rows.length > 1 ) {
          res.locals.course_instances = result.rows
          // showcasing using the checks
          res.locals.test_perms = await (async () => {
              return Promise.all(
                  result.rows.map(r =>
                      checks.staffHasPermissionsForCourseInstance(req, r.id)
                  )
              )
          })
      } else {
          res.locals.course_instances = []
          res.locals.test_perms = []
      }
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
    }
    res.redirect(req.originalUrl)
  })
)

module.exports = router
