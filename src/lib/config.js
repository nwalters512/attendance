var _ = require('lodash')
var fs = require('fs')

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
