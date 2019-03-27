var _ = require('lodash')
var fs = require('fs')
/* TODO wish was integrated into PrairieLib
 * var logger = require('../logger')
 * var jsonLoad = require('./json-load')
 */

var config = module.exports

config.PORT = process.env.PORT || 3000

config.postgresqlUser = 'attendance-adm'
config.postgresqlPassword = null
config.postgresqlDatabase = 'attendance'
config.postgresqlHost = 'localhost'
config.postgresqlPort = 5432

config.sqlFilePath = 'utils/db_setup/'

config.sqlInitFiles = [
  ['course', 'courseInstance', 'user'],
  [
    'meeting',
    'section',
    'student',
    'isOwner',
    'isCourseInstance',
    'userAssistsCourseInstance',
    'studentIsUser',
    'studentIsInSection',
  ],
  ['sectionMeeting'],
  ['swipe'],
]

/* TODO Add ability to load configs for non-devel env
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
*/
