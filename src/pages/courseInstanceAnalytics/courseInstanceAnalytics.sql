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

-- BLOCK select_count_students_in_cs
SELECT SUM(majorAggregate.enrollment) AS num_cs_in_ci
  FROM
  (SELECT Count(*) AS enrollment, students.major AS major
    FROM students
    INNER JOIN course_instances
    ON students.ci_term = course_instances.term
    AND students.ci_year = course_instances.year
    AND students.ci_name = course_instances.name
    INNER JOIN courses
    ON courses.name = course_instances.course_name
    GROUP BY students.major) majorAggregate
  WHERE major = 'CS';

-- BLOCK select_count_students_not_in_cs
SELECT SUM(majorAggregate.enrollment) AS num_not_cs_in_ci
  FROM
  (SELECT Count(*) AS enrollment, students.major AS major
    FROM students
    INNER JOIN course_instances
    ON students.ci_term = course_instances.term
    AND students.ci_year = course_instances.year
    AND students.ci_name = course_instances.name
    INNER JOIN courses
    ON courses.name = course_instances.course_name
    GROUP BY students.major) majorAggregate
  WHERE major <> 'CS' OR major IS NULL;
