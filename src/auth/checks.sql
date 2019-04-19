-- BLOCK get_user_permissions_for_instance
SELECT * FROM
	(SELECT * FROM course_instances WHERE id=$ciId) CI INNER JOIN user_assists_course_instance A
	ON (CI.year = A.ci_year AND CI.term = A.ci_term AND CI.name = A.ci_name)
WHERE
	A.email = $userEmail;


-- BLOCK get_user_is_owner_for_course
SELECT * FROM
	(SELECT * FROM courses WHERE id=$courseId) C INNER JOIN is_owner O
	ON (C.name = O.name)
WHERE
  O.email = $userEmail;

-- BLOCK get_user_is_owner_for_course_by_name
SELECT * FROM is_owner
WHERE
  email = $userEmail AND
  name = $courseName;

-- BLOCK user_is_student
SELECT * FROM
 student_is_user
WHERE
	UIN = $uin AND stu_ci_term = $ciTerm AND 
	stu_ci_name = $ciName AND stu_ci_year = $ciYear AND
	email = $userEmail;
