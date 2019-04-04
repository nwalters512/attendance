const ERR = require('async-stacktrace')
const router = require('express').Router({ mergeParams: true })
const { sqlDb, sqlLoader } = require('@prairielearn/prairielib')

const sql = sqlLoader.loadSqlEquiv(__filename)

router.get('/', (req, res, next) => {
  res.locals.sectionId = req.params.sectionId
  sqlDb.query(
    sql.select_section_meetings_join_sections,
    { sectionId: req.params.sectionId },

    (err, result) => {
      if (ERR(err, next)) return
      if (result.rows.length === 0) {
        res.redirect(req.originalUrl)
        return
      }

      const secRow = result.rows[0]
      res.locals.sectionName = secRow.name
      res.locals.section_meetings = result.rows
      res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
    }
  )
})

module.exports = router
