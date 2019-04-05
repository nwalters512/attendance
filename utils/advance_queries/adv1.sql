SELECT SUM(majorAggregate.enrollment)
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
WHERE major <> 'CS' OR major IS NULL
