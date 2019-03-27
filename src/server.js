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

const server = Server(app)
server.listen(config.PORT)
dbDriver.initDB()
logger.info(`Listening on ${config.PORT}`)
