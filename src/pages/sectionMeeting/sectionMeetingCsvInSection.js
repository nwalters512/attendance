const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const { Parser } = require('json2csv')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)
const parser = new Parser({ quote: '' })

const csvHeader =
  'id,m_name,ci_term,ci_name,ci_year,s_name,uin,stu_ci_term,stu_ci_name,stu_ci_year,meeting_name,sec_name'

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }

    const result = await dbDriver.asyncQuery(
      sql.select_swipes_in_section_join_section_meetings,
      { sectionMeetingId: req.params.sectionMeetingId }
    )
    res.attachment('swipesStudentsInSection.csv')
    if (result.rows.length === 0) {
      res.status(200).send(csvHeader)
      return
    }
    const csvResult = parser.parse(result.rows)
    res.status(200).send(csvResult)
  })
)

module.exports = router
