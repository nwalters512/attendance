-- BLOCK select_course_instances
SELECT * FROM course_instances WHERE id = $instId;

-- BLOCK select_sections
SELECT * FROM sections
WHERE ci_term = $ciTerm
AND ci_name = $ciName
AND ci_year = $ciYear;

-- BLOCK select_meetings
SELECT * FROM meetings
WHERE ci_term = $ciTerm
AND ci_name = $ciName
AND ci_year = $ciYear;

-- BLOCK select_sections_join_course_instances
SELECT *, course_instances.name AS ci_name,
course_instances.term AS ci_term,
course_instances.year AS ci_year
FROM course_instances
LEFT OUTER JOIN sections
ON (sections.ci_name = course_instances.name AND
sections.ci_term = course_instances.term AND
sections.ci_year = course_instances.year)
WHERE (course_instances.id = $instId);

-- BLOCK select_meetings_join_course_instances
SELECT *, course_instances.name AS ci_name,
course_instances.term AS ci_term,
course_instances.year AS ci_year
FROM course_instances
LEFT OUTER JOIN meetings
ON (meetings.ci_name = course_instances.name AND
meetings.ci_term = course_instances.term AND
meetings.ci_year = course_instances.year)
WHERE (course_instances.id = $instId);

-- BLOCK insert_sections
INSERT INTO sections
    (name, ci_term, ci_name, ci_year, CRN)
VALUES
    ($name, $ciTerm, $ciName, $ciYear, $CRN);

-- BLOCK insert_sections_sm
INSERT INTO section_meetings (m_name, m_ci_term, m_ci_name, m_ci_year, s_name, s_ci_term, s_ci_name, s_ci_year)
    SELECT meetings.name, meetings.ci_term, meetings.ci_name, meetings.ci_year, sections.name, sections.ci_term, sections.ci_name, sections.ci_year
    FROM meetings, sections
    WHERE sections.name = $name
    AND meetings.ci_term = $ciTerm
    AND meetings.ci_name = $ciName
    AND meetings.ci_year = $ciYear
    AND sections.ci_term = $ciTerm
    AND sections.ci_name = $ciName
    AND sections.ci_year = $ciYear;

-- BLOCK insert_meetings
INSERT INTO meetings
    (name, ci_term, ci_name, ci_year)
VALUES
    ($name, $ciTerm, $ciName, $ciYear);

-- BLOCK insert_meetings_sm
INSERT INTO section_meetings (m_name, m_ci_term, m_ci_name, m_ci_year, s_name, s_ci_term, s_ci_name, s_ci_year)
SELECT meetings.name, meetings.ci_term, meetings.ci_name, meetings.ci_year, sections.name, sections.ci_term, sections.ci_name, sections.ci_year
FROM meetings, sections
WHERE meetings.name = $name
AND meetings.ci_term = $ciTerm
AND meetings.ci_name = $ciName
AND meetings.ci_year = $ciYear
AND sections.ci_term = $ciTerm
AND sections.ci_name = $ciName
AND sections.ci_year = $ciYear;
