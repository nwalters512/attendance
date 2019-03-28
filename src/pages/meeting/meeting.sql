-- BLOCK select_meetings
SELECT * FROM meetings WHERE id = $meetingId;

-- BLOCK select_section_meetings
SELECT * FROM section_meetings
WHERE m_ci_term = $ciTerm
AND m_ci_name = $ciName
AND m_ci_year = $ciYear
AND m_name = $name;

