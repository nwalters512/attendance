const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')
const colorPallete = require('./colorPallete')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }

    const { courseInstanceId } = req.params
    const courseInstance = (await dbDriver.asyncQuery(
      sql.select_course_instance,
      { id: courseInstanceId }
    )).rows[0]
    res.locals.courseInstance = courseInstance

    const students = (await dbDriver.asyncQuery(
      sql.select_all_students_for_course_instance,
      {
        ci_term: courseInstance.term,
        ci_name: courseInstance.name,
        ci_year: courseInstance.year,
      }
    )).rows
    res.locals.students = students

    const numCS = (await dbDriver.asyncQuery(sql.select_count_students_in_cs, {
      ci_term: courseInstance.term,
      ci_name: courseInstance.name,
      ci_year: courseInstance.year,
    })).rows[0].num_cs_in_ci

    const numNonCS = (await dbDriver.asyncQuery(
      sql.select_count_students_not_in_cs,
      {
        ci_term: courseInstance.term,
        ci_name: courseInstance.name,
        ci_year: courseInstance.year,
      }
    )).rows[0].num_not_cs_in_ci
    const pieContent = [
      // { label: 'CS', value: numCS, color: '#44b9ae' },
      // { label: 'Non-CS', value: numNonCS, color: '#0a6097' },
      {
        label: 'CS',
        value: numCS,
        color: colorPallete[Math.floor(Math.random() * colorPallete.length)],
      },
      {
        label: 'Non-CS',
        value: numNonCS,
        color: colorPallete[Math.floor(Math.random() * colorPallete.length)],
      },
    ]
    res.locals.pieContent = pieContent

    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

module.exports = router
