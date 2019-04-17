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
INSERT INTO section_meetings (m_name, ci_term, ci_name, ci_year, s_name)
    SELECT meetings.name, meetings.ci_term, meetings.ci_name, meetings.ci_year, sections.name
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
INSERT INTO section_meetings (m_name, s_name, ci_term, ci_name, ci_year)
SELECT meetings.name, sections.name, sections.ci_term, sections.ci_name, sections.ci_year
FROM meetings, sections
WHERE meetings.name = $name
AND meetings.ci_term = $ciTerm
AND meetings.ci_name = $ciName
AND meetings.ci_year = $ciYear
AND sections.ci_term = $ciTerm
AND sections.ci_name = $ciName
AND sections.ci_year = $ciYear;

-- BLOCK insert_update_roster
INSERT INTO students (
    netid,
    UIN,
    ci_term,
    ci_name,
    ci_year,
    lastName,
    firstName,
    preferredName,
    email,
    college,
    major,
    admitTerm,
    credits,
    level
)
SELECT * FROM UNNEST (
    $netid::text[], 
    $UIN::bigint[],
    $ciTerm::text[],
    $ciName::text[],
    $ciYear::smallint[], 
    $lastName::text[], 
    $firstName::text[],
    $preferredName::text[],
    $emailAddress::text[],
    $College::text[],
    $majorName::text[],
    $admitTerm::text[],
    $Credit::smallint[],
    $Level::text[]
)
ON CONFLICT (UIN, ci_term, ci_name, ci_year) DO UPDATE
    SET netid = excluded.netid,
        lastName = excluded.lastName,
        firstName = excluded.firstName,
        email = excluded.email,
        college = excluded.college,
        major = excluded.major,
        admitTerm = excluded.admitTerm,
        credits = excluded.credits,
        level = excluded.level;


-- BLOCK select_staff
SELECT * FROM user_assists_course_instance INNER JOIN users
ON (user_assists_course_instance.email = users.email)
WHERE ci_term = $ciTerm AND ci_name = $ciName AND ci_year = $ciYear;


-- BLOCK add_staff
INSERT INTO user_assists_course_instance
    (email, ci_term, ci_name, ci_year)
VALUES
    ($email, $ciTerm, $ciName, $ciYear);


-- BLOCK remove_staff
DELETE FROM user_assists_course_instance
WHERE ci_term = $ciTerm AND ci_year = $ciYear
AND ci_name = $ciName AND email = $email;
