const router = require('express').Router()
const { sqlLoader } = require('@prairielearn/prairielib')
const { UNIQUE_VIOLATION } = require('pg-error-constants')
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
      email: req.user.email,
    }

    const results = await dbDriver.asyncQuery(
      sql.get_linked_students_with_info,
      params
    )

    res.locals.linked_course_data = results.rows

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

    const uin = Number.parseInt(req.body.uin, 10)

    if (Number.isNaN(uin)) {
      req.flash('error', 'Invalid UIN')
      res.redirect(req.originalUrl)
      return
    }

    const params = {
      email: req.user.email,
      uin,
    }

    await dbDriver.asyncQuery(sql.unlink_students, params)

    let results
    try {
      results = await dbDriver.asyncQuery(sql.link_students, params)
    } catch (e) {
      if (e.code && e.code === UNIQUE_VIOLATION) {
        req.flash('error', `Someone else has linked with UIN ${uin}`)
      } else {
        req.flash('error', `Cannot link against UIN ${uin}: ${e}`)
      }
      res.redirect(req.originalUrl)
      return
    }

    req.flash('info', `Linked with ${results.rowCount} courses`)
    res.redirect(req.originalUrl)
  })
)

module.exports = router
