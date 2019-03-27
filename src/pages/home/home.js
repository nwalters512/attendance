const ERR = require('async-stacktrace')
const router = require('express').Router()
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  sqlDb.query(sql.select_courses, [], (err, result) => {
    if (ERR(err, next)) return
    res.locals.courses = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
})

router.post('/', (req, res, next) => {
  if (req.body.__action === 'newCourse') {
    const params = {
      name: req.body.name,
      dept: req.body.dept,
      number: Number.parseInt(req.body.number, 10),
    }
    if (Number.isNaN(params.number)) {
      next(new Error(`Invalid course number: ${req.body.number}`))
      return
    }
    sqlDb.query(sql.insert_course, params, err => {
      if (ERR(err, next)) return
      res.redirect(req.originalUrl)
    })
  } else {
    res.redirect(req.originalUrl)
  }
})

module.exports = router
