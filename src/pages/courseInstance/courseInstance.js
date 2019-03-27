const router = require('express').Router({ mergeParams: true })

const sections = [
  {
    name: 'Hello!',
  },
  {
    name: 'World!',
  },
]

const meetings = [
  {
    name: 'Goodbye!',
  },
  {
    name: 'World!',
  },
]

router.get('/', (req, res, _next) => {
  res.locals.courseInstanceId = req.params.courseInstanceId
  res.locals.sections = sections
  res.locals.meetings = meetings
  res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
})

router.post('/', (req, res, _next) => {
  if (req.body.__action === 'newSection') {
    const section = {
      name: req.body.name,
    }
    sections.push(section)
  } else if (req.body.__action === 'newMeeting') {
    const meeting = {
      name: req.body.name,
    }
    meetings.push(meeting)
  }
  res.redirect(req.originalUrl)
})

module.exports = router
