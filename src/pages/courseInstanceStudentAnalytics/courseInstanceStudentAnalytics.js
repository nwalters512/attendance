// const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
// const { sqlLoader } = require('@prairielearn/prairielib')
// const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
// const checks = require('../../auth/checks')

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

module.exports = router
