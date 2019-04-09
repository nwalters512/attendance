const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../../dbDriver')
const asyncErrorHandler = require('../../asyncErrorHandler')
const checks = require('../../auth/checks')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get(
  '/',
  asyncErrorHandler(async (req, res, next) => {
    if (!(await checks.isLoggedIn(req))) {
      res.redirect('/login') // TODO: redirect back after login
      return
    }
    res.locals.sectionId = req.params.sectionId
    const result = await dbDriver.asyncQuery(
      sql.select_section_meetings_join_sections,
      { sectionId: req.params.sectionId }
    )
    if (result.rows.length === 0) {
      ERR(
        new Error(
          'Zero rows from query: select_section_meetings_join_sections'
        ),
        next
      )
      return
    }

    const secRow = result.rows[0]
    res.locals.sectionName = secRow.name
    res.locals.section_meetings = result.rows.filter(r => r.m_name && r.s_name)
    res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
  })
)

module.exports = router
