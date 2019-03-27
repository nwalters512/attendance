const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res, next) => {
  res.locals.courseId = req.params.courseId
  res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
})

module.exports = router
