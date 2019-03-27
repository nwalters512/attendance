const sqlLoader = require('@prairielearn/prairielib/sql-loader')
const sqlDB = require('@prairielearn/prairielib/sql-db')
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
    if (err) {
      if (callback) callback(err)
      return
    }

    const sqlPath_ = config.sqlFilePath
    const sqlInitFiles_ = config.sqlInitFiles
    const initFileList_ = []
    sqlInitFiles_.forEach(files => {
      files.forEach(file => {
        initFileList_.push(file)
      })
    })
    const initHelper = fList => {
      if (fList.length === 0) {
        if (callback) callback(null)
        return
      }
      const initFile_ = `${sqlPath_}${fList[0]}.sql`
      const initSql_ = sqlLoader.loadSqlEquiv(initFile_)
      sqlDB.query(initSql_.all, {}, errQuery => {
        if (errQuery) {
          if (callback) callback(errQuery)
          return
        }
        initHelper(fList.slice(1))
      })
    }
    initHelper(initFileList_)
  })
}
