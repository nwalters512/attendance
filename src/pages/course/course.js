const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res, _) => {
  res.locals.courseId = req.params.courseId
  res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
})

module.exports = router
