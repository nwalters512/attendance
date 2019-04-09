const ERR = require('async-stacktrace')
const router = require('express').Router()
const { UNIQUE_VIOLATION } = require('pg-error-constants')
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!await checks.isLoggedIn(req)) {
      res.redirect('/login') // TODO: redirect back after login
        return
    }
    const result = await dbDriver.asyncQuery(sql.select_courses, {})
    res.locals.courses = result.rows
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
    if (req.body.__action === 'newCourse') {
      let params = {
        name: req.body.name,
        dept: req.body.dept,
        number: Number.parseInt(req.body.number, 10),
      }

      if (Number.isNaN(params.number)) {
        ERR(new Error(`Invalid course number: ${req.body.number}`), next)
        return
      }

        try {
            await dbDriver.asyncQuery(sql.insert_course, params)
        } catch (e) {
            if (e.code && e.code === UNIQUE_VIOLATION) {
                req.flash('error', 'Course already exists')
                res.redirect(req.originalUrl)
                return
            }
      }

      params = {
          courseName: req.body.name,
          userEmail: req.user.email
      }

      await dbDriver.asyncQuery(sql.give_owner, params);

      res.redirect(req.originalUrl)

    } else if (req.body.__action === 'deleteCourse') {

        if (!await checks.staffIsOwnerOfCourse(req, req.body.id)) {
            req.flash("error", "You must be the owner of a course to delete it!");
            res.redirect(req.originalUrl);
            return
        }

      const params = {
        id: req.body.id,
      }

      await dbDriver.asyncQuery(sql.delete_course, params)

      res.redirect(req.originalUrl)

    } else {
      res.redirect(req.originalUrl)
    }
  })
)

module.exports = router
