const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  res.locals.courseId = req.params.courseId
  sqlDb.query(
    sql.select_course,
    { courseId: req.params.courseId },
    (err, result) => {
      if (ERR(err, next)) return
      if (result.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }
      const courseRow = result.rows[0]
      sqlDb.query(
        sql.select_course_instances,
        { course_name: courseRow.name },
        (errCI, resultCI) => {
          if (ERR(errCI, next)) return
          res.locals.courseDept = courseRow.dept
          res.locals.courseNumber = courseRow.number
          res.locals.courseName = courseRow.name
          res.locals.course_instances = resultCI.rows
          res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
        }
      )
    }
  )
})

router.post('/', (req, res, next) => {
  if (req.body.__action === 'newCourseInstance') {
    sqlDb.query(
      sql.select_course,
      { courseId: req.body.courseId },
      (err, result) => {
        if (ERR(err, next)) return
        if (result.rows.length === 0) {
          res.redirect(req.originalUrl)
          return
        }
        const courseRow = result.rows[0]
        const params = {
          term: req.body.term,
          name: req.body.name,
          year: Number.parseInt(req.body.year, 10),
          course_name: courseRow.name,
        }
        if (Number.isNaN(params.year)) {
          next(new Error(`Invalid year: ${req.body.year}`))
          return
        }
        sqlDb.query(sql.insert_course_instance, params, errIns => {
          if (ERR(errIns, next)) return
          res.redirect(req.originalUrl)
        })
      }
    )
  }
})

module.exports = router
