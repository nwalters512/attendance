const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
})

module.exports = router
