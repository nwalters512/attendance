-- BLOCK select_sections
SELECT * FROM sections WHERE id = $secId;

-- BLOCK select_section_meetings
SELECT * FROM section_meetings
WHERE ci_term = $ciTerm
AND ci_name = $ciName
AND ci_year = $ciYear
AND s_name = $name;

-- BLOCK select_section_meetings_join_sections
SELECT * FROM sections LEFT OUTER JOIN section_meetings
ON (sections.name = section_meetings.s_name AND
sections.ci_term = section_meetings.ci_term AND
sections.ci_name = section_meetings.ci_name AND
sections.ci_year = section_meetings.ci_year)
WHERE (sections.id = $sectionId);

-- BLOCK delete_section_enrollment
DELETE FROM student_is_in_section
WHERE sec_name = $secName
AND stu_ci_term = $ciTerm
AND stu_ci_name = $ciName
AND stu_ci_year = $ciYear;

-- BLOCK insert_student_is_in_section
INSERT INTO student_is_in_section (
UIN,
stu_ci_term,
stu_ci_name,
stu_ci_year,
sec_name
)
SELECT * FROM UNNEST (
$UIN::bigint[],
$ciTerm::text[],
$ciName::text[],
$ciYear::smallint[],
$secName::text[]
)
