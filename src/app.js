const app = require('express')()

app.use('/api/test', (req, res) => res.send('hello, world!'))

module.exports = app
