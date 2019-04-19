const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const {
  FOREIGN_KEY_VIOLATION,
  UNIQUE_VIOLATION,
} = require('pg-error-constants')
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
    res.locals.courseInstances = result.rows.filter(r => r.name)

    const ownerResult = await dbDriver.asyncQuery(sql.select_owners, {
      courseName: courseRow.course_name,
    })

    res.locals.courseOwners = ownerResult.rows

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
        req.flash('error', `Invalid year: ${req.body.year}`)
        res.redirect(req.originalUrl)
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
      await dbDriver.asyncQuery(sql.give_owners_instance_access, params)
    } else if (req.body.__action === 'addOwner') {
      if (!(await checks.staffIsOwnerOfCourse(req, req.params.courseId))) {
        req.flash('error', 'Must be owner to add new owners!')
        res.redirect(req.originalUrl)
        return
      }

      const params = {
        courseId: req.params.courseId,
        email: req.body.email.trim(),
      }

      let result
      try {
        result = await dbDriver.asyncQuery(sql.add_owner, params)
      } catch (e) {
        if (e.code && e.code === UNIQUE_VIOLATION) {
          req.flash('error', 'Cannot add duplicate owner')
        } else if (e.code && e.code === FOREIGN_KEY_VIOLATION) {
          req.flash('error', 'User does not exist')
        } else {
          ERR(new Error(`Error adding owner: ${e}`), next)
        }
        res.redirect(req.originalUrl)
        return
      }

      if (result.rowCount === 0) {
        req.flash('error', `No user with email ${req.body.email.trim()}`)
        res.redirect(req.originalUrl)
        return
      }
      req.flash('info', `Added user ${req.body.email.trim()} as an owner`)

      await dbDriver.asyncQuery(
        sql.retroactive_give_owner_instance_access,
        params
      )
    } else if (req.body.__action === 'removeOwner') {
      if (!(await checks.staffIsOwnerOfCourse(req, req.params.courseId))) {
        req.flash('error', 'Must be owner to remove owners!')
        res.redirect(req.originalUrl)
        return
      }

      if (req.user.email === req.body.email.trim()) {
        req.flash('error', 'Cannot remove yourself as owner!')
        res.redirect(req.originalUrl)
        return
      }

      const params = {
        courseId: req.params.courseId,
        email: req.body.email.trim(),
      }

      const result = await dbDriver.asyncQuery(sql.remove_owner, params)

      if (result.rowCount === 1) {
        req.flash('info', `Removed ${req.body.email.trim()}`)
      } else {
        ERR(
          new Error(
            `Did not get 1 row on remove_owner. Got: ${result.rowCount}`
          ),
          next
        )
      }
    }
    res.redirect(req.originalUrl)
  })
)

module.exports = router
