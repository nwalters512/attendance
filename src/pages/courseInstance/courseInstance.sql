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

-- BLOCK insert_sections
INSERT INTO sections
    (name, ci_term, ci_name, ci_year, CRN)
VALUES
    ($name, $ciTerm, $ciName, $ciYear, $CRN)

-- BLOCK insert_meetings
INSERT INTO meetings
(name, ci_term, ci_name, ci_year)
VALUES
($name, $ciTerm, $ciName, $ciYear)
