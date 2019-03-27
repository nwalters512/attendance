const { Server } = require('http')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const logger = require('./logger')

const PORT = process.env.PORT || 3000

const app = express()
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false, limit: 200 * 1024 }))
app.use(bodyParser.json())

app.use('/', require('./pages/home/home'))
app.use('/course', require('./pages/course/course'))

const server = Server(app)
server.listen(PORT)
logger.info(`Listening on ${PORT}`)
