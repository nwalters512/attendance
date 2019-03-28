const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res, _next) => {
  res.locals.meetingId = req.params.meetingId
  res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
})

module.exports = router
