const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    const result = await dbDriver.asyncQuery(sql.select_students, {})
    res.locals.students = result.rows
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

router.post(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (req.body.__action === 'updateStudent') {
      const params = {
        fName: req.body.firstName,
        lName: req.body.lastName,
        major: req.body.major,
        id: req.body.id,
      }
      await dbDriver.asyncQuery(sql.update_student, params)
      res.redirect(req.originalUrl)
    }
  })
)

module.exports = router
