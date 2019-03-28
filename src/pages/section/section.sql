-- BLOCK select_sections
SELECT * FROM sections WHERE id = $secId;

-- BLOCK select_section_meetings
SELECT * FROM section_meetings
WHERE s_ci_term = $ciTerm
AND s_ci_name = $ciName
AND s_ci_year = $ciYear
AND s_name = $name;
