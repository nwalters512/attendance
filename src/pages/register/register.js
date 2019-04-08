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
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    const hashedPw = crypto
      .createHash('sha256')
      .update(req.body.password)
      .digest('hex')

    // TODO: validate emails
    const params = {
      email: req.body.email,
      password: hashedPw,
      name: req.body.name,
      netid: req.body.netid,
    }

    try {
      await dbDriver.asyncQuery(sql.create_user, params)
      res.redirect('/login')
      return
    } catch (e) {
      if (e.code && e.code === UNIQUE_VIOLATION) {
        req.flash('error', 'User already exists')
      } else {
        req.flash('error', `Unknown error: ${e}`)
      }

      res.redirect('/register')
    }
  })
)

module.exports = router
