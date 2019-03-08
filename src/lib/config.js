var _ = require('lodash')
var fs = require('fs')
var logger = require('./logger')
var jsonLoad = require('./json-load')

var config = module.exports

config.postgresqlUser = 'attendance-adm'
config.postgresqlPassword = null
config.postgresqlDatabase = 'attendance'
config.postgresqlHost = 'localhost'

config.loadConfig = function(file) {
  if (fs.existsSync(file)) {
    let fileConfig = jsonLoad.readJSONSyncOrDie(
      file,
      'schemas/serverConfig.json'
    )
    _.assign(config, fileConfig)
  } else {
    logger.warn(file + ' not found, using default configuration')
  }
}
