const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const { UNIQUE_VIOLATION } = require('pg-error-constants')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!(await checks.isLoggedIn(req))) {
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
    if (result.rows.length >= 1 && courseRow.name !== undefined && courseRow.name !== null) {
      res.locals.course_instances = result.rows
    } else {
      res.locals.course_instances = []
    }
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.sendStatus(403)
      return
    }
    if (req.body.__action === 'newCourseInstance') {
      if (!(await checks.staffIsOwnerOfCourse(req, req.params.courseId))) {
        req.flash('error', 'Must be owner to add new course instances!')
        res.redirect(req.originalUrl)
        return
      }

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
      try {
        await dbDriver.asyncQuery(sql.insert_course_instance, params)
      } catch (e) {
        if (e.code && e.code === UNIQUE_VIOLATION) {
          req.flash('error', 'Course instance already exists')
          res.redirect(req.originalUrl)
          return
        }
      }

      params.email = req.user.email

      await dbDriver.asyncQuery(sql.give_instance_access, params)
    }
    res.redirect(req.originalUrl)
  })
)

module.exports = router
