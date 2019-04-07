const router = require('express').Router()
const passport = require("passport")
const asyncErrorHandler = require('../../asyncErrorHandler')

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
  })
)

module.exports = router
