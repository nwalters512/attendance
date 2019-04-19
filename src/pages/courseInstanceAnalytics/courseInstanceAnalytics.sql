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

-- BLOCK select_count_students_by_major
SELECT (CASE WHEN major IS NULL THEN 'UNKNOWN' ELSE major END) AS major, ( COUNT((CASE WHEN major IS NULL THEN 'UNKNOWN' ELSE major END))) AS enrollment FROM students
  INNER JOIN course_instances
  ON students.ci_term = course_instances.term
    AND students.ci_year = course_instances.year
    AND students.ci_name = course_instances.name
  INNER JOIN courses
  ON courses.name = course_instances.course_name
  WHERE (course_instances.term = $ci_term
    AND course_instances.name = $ci_name
    AND course_instances.year = $ci_year)
  GROUP BY major;

-- BLOCK select_avg_attendance_rate_by_major
(SELECT (CASE WHEN major IS NULL THEN 'UNKNOWN' ELSE major END) AS major, 100*( COUNT((CASE WHEN major IS NULL THEN 'UNKNOWN' ELSE major END))*1.0 / (SELECT COUNT(*) FROM meetings
  WHERE (meetings.ci_term = $ci_term
    AND meetings.ci_name = $ci_name
    AND meetings.ci_year = $ci_year) ) ) AS attendencerate
  FROM students
    INNER JOIN section_meetings
      ON section_meetings.ci_term = students.ci_term
        AND section_meetings.ci_name = students.ci_name
        AND section_meetings.ci_year = students.ci_year
    INNER JOIN swipes
      ON swipes.stu_ci_term = students.ci_term
        AND swipes.stu_ci_name = students.ci_name
        AND swipes.stu_ci_year = students.ci_year
        AND swipes.UIN = students.UIN
        AND swipes.meeting_name = section_meetings.m_name
        AND swipes.sec_name = section_meetings.s_name
    WHERE (section_meetings.ci_term = $ci_term
      AND section_meetings.ci_name = $ci_name
      AND section_meetings.ci_year = $ci_year)
    GROUP BY major);

-- BLOCK select_swipetimes_per_section_meeting
SELECT CONCAT(sec_name, ' ', meeting_name) AS sectionmeeting, swipe_timestamp AS studentswipe FROM swipes
  WHERE (swipes.stu_ci_term = $ci_term
    AND swipes.stu_ci_name = $ci_name
    AND swipes.stu_ci_year = $ci_year);


















--
