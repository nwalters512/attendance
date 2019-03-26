const { Server } = require('http')
const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

const PORT = process.env.PORT || 3000
const DEV = ['production'].indexOf(process.env.NODE_ENV) === -1

const app = express()
app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'ejs')

app.use('/', require('./pages/home/home'))

const server = Server(app)
server.listen(PORT)
console.info(`Listening on ${PORT}`)
