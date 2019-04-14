const path = require('path')

const config = module.exports

config.PORT = process.env.PORT || 3000

config.secret = 'I AM REALLY SECRET'

config.postgresqlUser = 'attendance-adm'
config.postgresqlPassword = null
config.postgresqlDatabase = 'attendance'
config.postgresqlHost = 'localhost'
config.postgresqlPort = 5432

config.sqlFilePath = path.join('utils', 'db_setup/')

config.sqlInitFiles = [
  ['course', 'user', 'session'],
  [
    'courseInstance',
    'meeting',
    'section',
    'student',
    'isOwner',
    'userAssistsCourseInstance',
    'studentIsUser',
    'studentIsInSection',
  ],
  ['sectionMeeting'],
  ['swipe'],
]
