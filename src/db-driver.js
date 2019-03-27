const sqlLoader = require('@prairielearn/prairielib/sql-loader')
const sqlDB = require('@prairielearn/prairielib/sql-db')
const ERR = require('async-stacktrace')
const config = require('./lib/config.js')
const logger = require('./logger')
const fs = require('fs')

var dbDriver = module.exports

const pgConf = {
  host: config.postgresqlHost,
  port: config.postgresqlPort,
  user: config.postgresqlUser,
  password: config.postgresqlPassword,
  database: config.postgresqlDatabase,
}

const logError = function(err) {
  if (err) {
    console.error('Error due to dbDriver', err.stack)
  }
}

sqlDB.init(pgConf, logError, logError)

dbDriver.initDB = function() {
  var sqlPath_ = config.sqlFilePath
  var sqlInitFiles_ = config.sqlInitFiles
  var initFileList_ = []
  sqlInitFiles_.forEach(files => {
    files.forEach(file => {
      initFileList_.push(file)
    })
  })
  var initHelper = fList => {
    if (fList.length === 0) {
      logger.info('Finished initializing database')
      return
    }
    var initFile_ = sqlPath_ + fList[0] + '.sql'
    var initSql_ = sqlLoader.loadSqlEquiv(initFile_)
    sqlDB.query(initSql_['all'], {}, err => {
      if (err) logError(err)
      initHelper(fList.slice(1))
    })
  }
  initHelper(initFileList_)
}

dbDriver.query = sqlDB.query
dbDriver.queryOneRow = sqlDB.queryOneRow
dbDriver.queryWithZeroOrOneRow = sqlDB.queryWithZeroOrOneRow
