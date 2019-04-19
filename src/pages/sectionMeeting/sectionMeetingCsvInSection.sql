-- BLOCK select_course_instance_id_from_section_meeting_id
SELECT course_instances.id AS ci_id FROM section_meetings INNER JOIN course_instances
ON (section_meetings.ci_term = course_instances.term
AND section_meetings.ci_name = course_instances.name
AND section_meetings.ci_year = course_instances.year)
WHERE (section_meetings.id = $sectionMeetingId);

-- BLOCK select_swipes_in_section_join_section_meetings
SELECT * FROM section_meetings INNER JOIN swipes
ON (swipes.meeting_name = section_meetings.m_name
   AND swipes.sec_name = section_meetings.s_name
   AND swipes.stu_ci_term = section_meetings.ci_term
   AND swipes.stu_ci_name = section_meetings.ci_name
   AND swipes.stu_ci_year = section_meetings.ci_year)
INNER JOIN student_is_in_section
ON (student_is_in_section.UIN = swipes.UIN
   AND student_is_in_section.sec_name = section_meetings.s_name
   AND student_is_in_section.stu_ci_term = section_meetings.ci_term
   AND student_is_in_section.stu_ci_name = section_meetings.ci_name
   AND student_is_in_section.stu_ci_year = section_meetings.ci_year)
WHERE (section_meetings.id = $sectionMeetingId);
