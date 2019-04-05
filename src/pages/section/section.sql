-- BLOCK select_sections
SELECT * FROM sections WHERE id = $secId;

-- BLOCK select_section_meetings
SELECT * FROM section_meetings
WHERE s_ci_term = $ciTerm
AND s_ci_name = $ciName
AND s_ci_year = $ciYear
AND s_name = $name;

-- BLOCK select_section_meetings_join_sections
SELECT * FROM sections LEFT OUTER JOIN section_meetings
ON (sections.name = section_meetings.s_name AND
sections.ci_term = section_meetings.s_ci_term AND
sections.ci_name = section_meetings.s_ci_name AND
sections.ci_year = section_meetings.s_ci_year)
WHERE (sections.id = $sectionId);
