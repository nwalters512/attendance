const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res, _next) => {
  res.locals.sectionId = req.params.sectionId
  res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
})

module.exports = router
