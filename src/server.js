const { Server } = require('http')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const logger = require('./logger')
const config = require('./lib/config.js')
const dbDriver = require('./db-driver')

const app = express()
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false, limit: 200 * 1024 }))
app.use(bodyParser.json())

app.use('/', require('./pages/home/home'))
app.use('/course/:courseId', require('./pages/course/course'))
app.use(
  '/courseInstance/:courseInstanceId',
  require('./pages/courseInstance/courseInstance')
)
app.use('/section/:sectionId', require('./pages/section/section'))
app.use('/meeting/:meetingId', require('./pages/meeting/meeting'))
app.use(
  '/sectionMeeting/:sectionMeetingId',
  require('./pages/sectionMeeting/sectionMeeting')
)

const server = Server(app)
dbDriver.initDB(
  err => {
    if (err) {
      logger.error('DB initialization failed')
      logger.error(err)
      return
    }
    logger.info('Finished DB initialization.')
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
