-- BLOCK select_meetings
SELECT * FROM meetings WHERE id = $meetingId;

-- BLOCK select_section_meetings
SELECT * FROM section_meetings
WHERE ci_term = $ciTerm
AND ci_name = $ciName
AND ci_year = $ciYear
AND m_name = $name;

-- BLOCK select_section_meetings_join_meetings
SELECT * FROM meetings LEFT OUTER JOIN section_meetings
ON (meetings.name = section_meetings.m_name AND
meetings.ci_term = section_meetings.ci_term AND
meetings.ci_name = section_meetings.ci_name AND
meetings.ci_year = section_meetings.ci_year)
WHERE (meetings.id = $meetingId);
