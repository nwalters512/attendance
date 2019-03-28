const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  res.locals.sectionId = req.params.sectionId
  sqlDb.query(
    sql.select_sections,
    { secId: req.params.sectionId },
    (err, result) => {
      if (ERR(err, next)) return
      if (result.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }
      const secRow = result.rows[0]
      sqlDb.query(
        sql.select_section_meetings,
        {
          ciTerm: secRow.ci_term,
          ciName: secRow.ci_name,
          ciYear: secRow.ci_year,
          name: secRow.name,
        },
        (errSec, resultSec) => {
          if (ERR(errSec, next)) return
          res.locals.sectionName = secRow.name
          res.locals.section_meetings = resultSec.rows
          res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
        }
      )
    }
  )
})

module.exports = router
