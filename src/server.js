const { Server } = require('http')
const express = require('express')
const path = require('path')
const logger = require('./logger')

const PORT = process.env.PORT || 3000

const app = express()
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')

app.use('/', require('./pages/home/home'))

const server = Server(app)
server.listen(PORT)
logger.info(`Listening on ${PORT}`)
