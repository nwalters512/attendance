-- BLOCK select_swipes_join_section_meetings
SELECT * FROM section_meetings INNER JOIN swipes
ON (swipes.meeting_name = section_meetings.m_name
   AND swipes.sec_name = section_meetings.s_name
   AND swipes.stu_ci_term = section_meetings.ci_term
   AND swipes.stu_ci_name = section_meetings.ci_name
   AND swipes.stu_ci_year = section_meetings.ci_year)
WHERE (section_meetings.id = $sectionMeetingId);
