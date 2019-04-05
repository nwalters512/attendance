SELECT (SELECT AVG(nonMajorAttendance.attendance)
               FROM
               (SELECT COUNT(*) AS attendance
                       FROM students
                       INNER JOIN section_meetings
                       ON section_meetings.m_ci_term = students.ci_term
                       AND section_meetings.m_ci_name = students.ci_name
                       AND section_meetings.m_ci_year = students.ci_year
                       GROUP BY major
                       HAVING major <> 'CS' OR major IS NULL) nonMajorAttendance) / COUNT(*) AS avg_num_non_majors_per_section_meeting
FROM section_meetings
