const crypto = require('crypto')
const { UNIQUE_VIOLATION } = require('pg-error-constants')
const router = require('express').Router()
const { sqlLoader } = require('@prairielearn/prairielib')
const asyncErrorHandler = require('../../asyncErrorHandler')
const dbDriver = require('../../dbDriver')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    res.locals.linked_course_data = [{ci_name: "CS225 SP19", ci_term: "Spring", ci_year: 2019 }]

    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, _next) => {

  })
)

module.exports = router
