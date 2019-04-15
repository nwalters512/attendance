-- BLOCK select_course_instance
SELECT * FROM course_instances WHERE id = $id;

-- BLOCK select_all_students_for_course_instance
SELECT
  id,
  UIN,
  firstName,
  lastName,
  preferredName,
  netid
FROM
  students
WHERE
  ci_term = $ci_term
  AND ci_name = $ci_name
  AND ci_year = $ci_year;
