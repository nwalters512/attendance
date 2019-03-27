const ERR = require('async-stacktrace')
const sqlLoader = require('@prairielearn/prairielib/sql-loader')
const sqlDB = require('@prairielearn/prairielib/sql-db')
const path = require('path')
const config = require('./lib/config.js')

const dbDriver = module.exports

const pgConf = {
  host: config.postgresqlHost,
  port: config.postgresqlPort,
  user: config.postgresqlUser,
  password: config.postgresqlPassword,
  database: config.postgresqlDatabase,
}

dbDriver.initDB = (callback, idleErrCb) => {
  sqlDB.init(pgConf, idleErrCb, err => {
    if (ERR(err, callback)) return

    const sqlPath = config.sqlFilePath
    const { sqlInitFiles } = config
    const initFileList = []
    sqlInitFiles.forEach(files => {
      files.forEach(file => {
        initFileList.push(file)
      })
    })
    const initHelper = fList => {
      if (fList.length === 0) {
        if (ERR(err, callback)) return
        callback(null)
      }
      const initFile = path.join(sqlPath, `${fList[0]}.sql`)
      const initSql = sqlLoader.loadSqlEquiv(initFile)
      sqlDB.query(initSql.all, {}, queryErr => {
        if (ERR(queryErr, callback)) return
        initHelper(fList.slice(1))
      })
    }
    initHelper(initFileList)
  })
}
