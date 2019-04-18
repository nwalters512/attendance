const ERR = require('async-stacktrace')
const sqlLoader = require('@prairielearn/prairielib/sql-loader')
const sqlDB = require('@prairielearn/prairielib/sql-db')
const path = require('path')
const config = require('../lib/config.js')

const dbDriver = module.exports

const pgConf =
  config.MODE === 'dev'
    ? {
        host: config.postgresqlHost,
        port: config.postgresqlPort,
        user: config.postgresqlUser,
        password: config.postgresqlPassword,
        database: config.postgresqlDatabase,
      }
    : {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      }

dbDriver.initDB = (callback, idleErrCb) => {
  sqlDB.init(pgConf, idleErrCb, err => {
    if (ERR(err, callback)) return

    const { sqlInitFiles, sqlFilePath } = config
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
        return
      }
      const initFile = path.join(sqlFilePath, `${fList[0]}.sql`)
      const initSql = sqlLoader.loadSqlEquiv(initFile)
      sqlDB.query(initSql.all, {}, queryErr => {
        if (queryErr) {
          // eslint-disable-next-line no-param-reassign
          queryErr.message += ` (file: ${initFile}`
        }
        if (ERR(queryErr, callback)) return
        initHelper(fList.slice(1))
      })
    }
    initHelper(initFileList)
  })
}

dbDriver.asyncQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    sqlDB.query(query, params, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
