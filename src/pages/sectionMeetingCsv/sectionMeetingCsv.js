const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const { Parser } = require('json2csv')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)
const parser = new Parser()

router.get(
  '/',
  asyncErrorHandler(async (req, res, _next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }

    const result = await dbDriver.asyncQuery(
      sql.select_swipes_join_section_meetings,
      { sectionMeetingId: req.params.sectionMeetingId }
    )
    if (result.rows.length === 0) {
      return
    }
    const csvResult = parser.parse(result.rows)
    res.attachment('swipes.csv')
    res.status(200).send(csvResult)
  })
)

module.exports = router
