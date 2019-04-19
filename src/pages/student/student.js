const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }

    if (
      !(await checks.staffHasPermissionsForCourseInstance(
        req,
        req.params.courseInstanceId
      ))
    ) {
      res.sendStatus(403)
      return
    }

    const result = await dbDriver.asyncQuery(sql.select_students, {
      ciId: req.params.courseInstanceId,
    })
    res.locals.students = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.sendStatus(403)
      return
    }
    if (
      !(await checks.staffHasPermissionsForCourseInstance(
        req,
        req.params.courseInstanceId
      ))
    ) {
      res.sendStatus(403)
      return
    }
    if (req.body.__action === 'updateStudent') {
      const params = {
        fName: req.body.firstName,
        lName: req.body.lastName,
        netid: req.body.netid,
        major: req.body.major,
        id: req.body.id,
      }
      await dbDriver.asyncQuery(sql.update_student, params)
      res.redirect(req.originalUrl)
    }
  })
)

module.exports = router
