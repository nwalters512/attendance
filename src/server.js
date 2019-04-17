/* eslint-disable global-require */
const { Server } = require('http')
const express = require('express')
const session = require('express-session')
const PostgresSession = require('connect-pg-simple')(session)
const flash = require('connect-flash')
const path = require('path')
const bodyParser = require('body-parser')
const sqlDB = require('@prairielearn/prairielib/sql-db')

const logger = require('./logger')
const config = require('./lib/config.js')
const dbDriver = require('./dbDriver')
const { setupPassport } = require('./auth/passport-config.js')

function createApp() {
  const app = express()
  app.set('views', path.join(__dirname, 'pages'))
  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({ extended: false, limit: 200 * 1024 }))
  app.use(bodyParser.json())
  app.use(express.static('static'))
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: config.secret,
      store: new PostgresSession({
        pool: sqlDB.pool,
      }),
    })
  )
  app.use(flash())

  setupPassport(app)

  // bind flashes for all pages
  app.use((req, res, next) => {
    res.locals._err = req.flash('error')
    res.locals._info = req.flash('info')
    next()
  })
  // bind the logged in user, for the header
  app.use((req, res, next) => {
    res.locals._user = req.user
    next()
  })

  app.use('/', require('./pages/home/home'))
  app.use('/login', require('./pages/login/login'))
  app.use('/register', require('./pages/register/register'))

  app.use('/logout', (req, res, _) => {
    req.logout()
    res.redirect('/')
  })
  app.use('/student', require('./pages/student/student'))
  app.use('/link', require('./pages/link/link'))
  app.use('/course/:courseId', require('./pages/course/course'))
  app.use(
    '/courseInstance/:courseInstanceId',
    require('./pages/courseInstance/courseInstance')
  )
  app.use(
    '/courseInstance/:courseInstanceId/analytics',
    require('./pages/courseInstanceAnalytics/courseInstanceAnalytics')
  )
  app.use(
    '/courseInstance/:courseInstanceId/analytics/student/:studentId',
    require('./pages/courseInstanceStudentAnalytics/courseInstanceStudentAnalytics')
  )
  app.use('/section/:sectionId', require('./pages/section/section'))
  app.use('/meeting/:meetingId', require('./pages/meeting/meeting'))
  app.use(
    '/sectionMeeting/:sectionMeetingId',
    require('./pages/sectionMeeting/sectionMeeting')
  )

  return app
}

dbDriver.initDB(
  err => {
    if (err) {
      logger.error('DB initialization failed')
      logger.error(err)
      return
    }
    logger.info('Finished DB initialization.')
    const app = createApp()
    const server = Server(app)
    server.listen(config.PORT)
    logger.info(`Listening on ${config.PORT}`)
  },
  err => {
    if (err) {
      logger.error('DB initialization failed due to idle error.')
      logger.error(err)
    }
  }
)
