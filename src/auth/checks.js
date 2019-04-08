const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../dbDriver')

const sql = sqlLoader.loadSqlEquiv(__filename)

const checks = module.exports

checks.isLoggedIn = async req => {
  return req.user !== undefined && req.user !== null
}

checks.staffHasPermissionsForCourseInstance = async (req, instanceId) => {
  const params = {
    userEmail: req.user.email,
    ciId: instanceId,
  }
  const results = await dbDriver.asyncQuery(
    sql.get_user_permissions_for_instance,
    params
  )

  return results.rows.length > 0
}
