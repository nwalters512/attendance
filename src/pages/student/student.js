const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  sqlDb.query(sql.select_students, [], (err, result) => {
    if (ERR(err, next)) return
    res.locals.students = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
})

router.post('/', (req, res, next) => {
  if (req.body.__action === 'updateStudent') {
    const params = {
      fName: req.body.firstName,
      lName: req.body.lastName,
      major: req.body.major,
      id: req.body.id,
    }
    sqlDb.query(sql.update_student, params, (err, _result) => {
      if (ERR(err, next)) return
      res.redirect(req.originalUrl)
    })
  }
})

module.exports = router
