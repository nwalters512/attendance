-- BLOCK select_course_instance
SELECT * FROM course_instances WHERE id = $id;

-- BLOCK select_student
SELECT * FROM students WHERE id = $id;

-- BLOCK select_meetings
SELECT
  *,
  (
    SELECT
      COUNT(*)
    FROM
      swipes
    WHERE
      UIN = $uin
      AND meeting_name = meetings.name
      AND stu_ci_term = meetings.ci_term
      AND stu_ci_name = meetings.ci_name
      AND stu_ci_year = meetings.ci_year
  )::INTEGER AS student_attendance_count,
  EXISTS (
    SELECT
      *
    FROM
      swipes AS s
    WHERE
      meeting_name = meetings.name
      AND stu_ci_term = meetings.ci_term
      AND stu_ci_name = meetings.ci_name
      AND stu_ci_year = meetings.ci_year
  ) AS any_student_has_attended
FROM
  meetings
WHERE
  ci_term = $ci_term
  AND ci_name = $ci_name
  AND ci_year = $ci_year;
