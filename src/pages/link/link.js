const crypto = require('crypto')
const { UNIQUE_VIOLATION } = require('pg-error-constants')
const router = require('express').Router()
const { sqlLoader } = require('@prairielearn/prairielib')
const asyncErrorHandler = require('../../asyncErrorHandler')
const dbDriver = require('../../dbDriver')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {

    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }

      const params = {
          email: req.user.email
      }

    //res.locals.linked_course_data = [{ci_name: "CS225 SP19", ci_term: "Spring", ci_year: 2019 }]
      const results = await dbDriver.asyncQuery(
          sql.get_linked_students,
          params
      );

      res.locals.linked_course_data = results.rows;

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

  })
)

module.exports = router
