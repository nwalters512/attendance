const { Server } = require('http')
const next = require('next')
const co = require('co')

const app = require('./app')
const routes = require('./routes')

const PORT = process.env.PORT || 3000
const DEV = ['production'].indexOf(process.env.NODE_ENV) === -1

const nextApp = next({ dev: DEV, dir: 'src' })
const handler = routes.getRequestHandler(nextApp)

co(function*() {
  yield nextApp.prepare()
  const server = Server(app)
  app.use(handler)
  server.listen(PORT)
  console.info(`Listening on ${PORT}`)
}).catch(e => console.error(e))
