const { sqlLoader } = require('@prairielearn/prairielib')
const dbDriver = require('../dbDriver')

const sql = sqlLoader.loadSqlEquiv(__filename)

const checks = module.exports

checks.isLoggedIn = async req => {
  return req.user !== undefined && req.user !== null
}

// consider a version which takes the primary key (only the name)
checks.staffIsOwnerOfCourse = async (req, courseId) => {
		const params = {
				userEmail: req.user.email,
				courseId,
		}

		const results = await dbDriver.asyncQuery(
				sql.get_user_is_owner_for_course,
				params
		)

		return results.rows.length > 0
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
