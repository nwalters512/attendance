-- BLOCK get_user_permissions_for_instance
SELECT * FROM
	(SELECT * FROM course_instances WHERE id=$ciId) CI INNER JOIN user_assists_course_instance A
	ON (CI.year = A.ci_year AND CI.term = A.ci_term AND CI.name = A.ci_name)
WHERE
	A.email = $userEmail;
