const { Pool } = require('pg')
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

const pool = new Pool(pgConf)

dbDriver.initDB = function() {
  var sqlPath_ = config.sqlFilePath
  var sqlInitFiles_ = config.sqlInitFiles
  sqlInitFiles_.forEach(files => {
    files.forEach(file => {
      var initFile_ = sqlPath_ + file + '.sql'
      //var initSql_ = sqlLoader.loadSqlEquiv(initFile_)
      var query_ = fs.readFileSync(initFile_, 'utf8').toString()
      pool.query(query_, (err, result) => {
        if (err) {
          logger.error('Error executing init query', err.stack)
        }
      })
      //pool.query(initSql_, undefined, logInfo)
    })
  })
}

/* TODO PrairieLib interface code, need to debug later
//const sqlLoader = require('@prairielearn/prairielib/sql-loader')
//const sqlDB = require('@prairielearn/prairielib/sql-db')

//sqlDB.init(pgConf, logError, logError)

const logError = function(err) {
    // TODO Figure out how to handle these later
    //logger.error(err)
}

const logInfo = function(info) {
    // TODO Figure out how to handle these later
    //logger.info(info)
}

/*
dbDriver.initDB = function() {
    var sqlPath_ = config.sqlFilePath
    var sqlInitFiles_ = config.sqlInitFiles
    sqlInitFiles_.forEach((files) => {
        files.forEach((file) => {
            var initFile_ = sqlPath_ + file + '.sql'
            var initSql_ = sqlLoader.loadSqlEquiv(initFile_)
            sqlDB.query(initSql_, {}, logInfo)
        })
    })
}
*/
