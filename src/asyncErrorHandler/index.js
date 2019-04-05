const ERR = require('async-stacktrace')

module.exports = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => ERR(err, next))
}
