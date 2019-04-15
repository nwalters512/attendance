// const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
// const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    const courseInstance = (await dbDriver.asyncQuery(
      sql.select_course_instance,
      { id: req.params.courseInstanceId }
    )).rows[0]
    res.locals.courseInstance = courseInstance

    const student = (await dbDriver.asyncQuery(sql.select_student, {
      id: req.params.studentId,
    })).rows[0]
    res.locals.student = student

    const courseInstanceParams = {
      ci_term: courseInstance.term,
      ci_name: courseInstance.name,
      ci_year: courseInstance.year,
    }

    const meetings = await dbDriver.asyncQuery(sql.select_meetings, {
      uin: student.uin,
      ...courseInstanceParams,
    })
    res.locals.meetings = meetings.rows

    const studentAttendedMeetingsCount = meetings.rows.reduce(
      (acc, meeting) => {
        if (meeting.student_attendance_count > 0) {
          return acc + 1
        }
        return acc
      },
      0
    )
    const attendedMeetingsCount = meetings.rows.reduce((acc, meeting) => {
      if (meeting.any_student_has_attended) {
        return acc + 1
      }
      return acc
    }, 0)
    res.locals.studentAttendedMeetingsCount = studentAttendedMeetingsCount
    res.locals.attendedMeetingsCount = attendedMeetingsCount

    res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
  })
)

module.exports = router
