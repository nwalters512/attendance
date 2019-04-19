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

    const numPerMajor = (await dbDriver.asyncQuery(
      sql.select_count_students_by_major,
      {
        ci_term: courseInstance.term,
        ci_name: courseInstance.name,
        ci_year: courseInstance.year,
      }
    )).rows

    const pieContent = []
    numPerMajor.forEach(element => {
      pieContent.push({
        label: element.major,
        value: element.enrollment,
        color: colorPallete[Math.floor(Math.random() * colorPallete.length)],
      })
    })
    res.locals.pieContent = pieContent

    const barContent = (await dbDriver.asyncQuery(
      sql.select_avg_attendance_rate_by_major,
      {
        ci_term: courseInstance.term,
        ci_name: courseInstance.name,
        ci_year: courseInstance.year,
      }
    )).rows
    res.locals.barContent = barContent

    const lineContent = (await dbDriver.asyncQuery(
      sql.select_swipetimes_per_section_meeting,
      {
        ci_term: courseInstance.term,
        ci_name: courseInstance.name,
        ci_year: courseInstance.year,
      }
    )).rows
    res.locals.lineContent = lineContent

    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

module.exports = router
