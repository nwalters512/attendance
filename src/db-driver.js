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

dbDriver.initDB = function(callback, idleErrCb) {
  sqlDB.init(pgConf, idleErrCb, err => {
    if (err) {
      return callback ? callback(err) : null
    }

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
        return callback ? callback(null) : null
      }
      var initFile_ = sqlPath_ + fList[0] + '.sql'
      var initSql_ = sqlLoader.loadSqlEquiv(initFile_)
      sqlDB.query(initSql_['all'], {}, err => {
        if (err) return callback ? callback(err) : null
        initHelper(fList.slice(1))
      })
    }
    initHelper(initFileList_)
  })
}
