const router = require('express').Router()

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

router.get('/:courseId', (req, res, next) => {
  res.locals.courseId = req.params.courseId
  res.locals.sections = sections
  res.locals.meetings = meetings
  res.render(__filename.replace(/\.js/, '.ejs'), res.locals)
})

router.post('/:courseId', (req, res, next) => {
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
