const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res, _next) => {
    res.locals.courseId = req.params.courseId
    // TODO add param
    sqlDb.query(sql.select_course_instances, [], (err, result) => {
        if (ERR(err, next)) return
        res.locals.course_instances = result.rows
        res.render(__filename.replace(/\.js$/, '.ejs'), res.locals)
    })
})

router.post('/', (req, res, next) => {
    if (req.body.___action === 'newCourseInstance') {
        const params = {
            term: req.body.term,
            name: ,
            year: Number.parseInt(req.body.year, 10),
        }
        if (Number.isNaN(params.year)) {
          next(new Error(`Invalid year: ${req.body.year}`))
          return
        }
        sqlDb.query()
    }
})

module.exports = router
