const app = require('express')()

const { withBaseUrl } = require('./util')

app.use(withBaseUrl('/api/test'), require('./api/test'))

module.exports = app
