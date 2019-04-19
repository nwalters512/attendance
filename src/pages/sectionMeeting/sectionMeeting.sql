-- BLOCK select_section_meetings
SELECT * FROM section_meetings WHERE id = $sectionMeetingId;

-- BLOCK select_swipes
SELECT * FROM swipes
WHERE meeting_name = $mname
AND sec_name = $sname;

-- BLOCK select_swipes_join_section_meetings
SELECT * FROM section_meetings LEFT OUTER JOIN swipes
ON (swipes.meeting_name = section_meetings.m_name
   AND swipes.sec_name = section_meetings.s_name
   AND swipes.stu_ci_term = section_meetings.ci_term
   AND swipes.stu_ci_name = section_meetings.ci_name
   AND swipes.stu_ci_year = section_meetings.ci_year)
WHERE (section_meetings.id = $sectionMeetingId);


-- BLOCK insert_students
INSERT INTO students
    (UIN, ci_term, ci_name, ci_year)
VALUES
    ($UIN, $ciTerm, $ciName, $ciYear)
ON CONFLICT
DO NOTHING;

/*
SELECT $UIN, $ciTerm, $ciName, $ciYear
       WHERE NOT EXISTS (
            SELECT * FROM students
            WHERE UIN = $UIN
            AND ci_term = $ciTerm
            AND ci_name = $ciName
            AND ci_year = $ciYear
       );
*/

-- BLOCK insert_swipes
INSERT INTO swipes
    (UIN, stu_ci_term, stu_ci_name, stu_ci_year, meeting_name, sec_name, swipe_timestamp)
VALUES
    ($UIN, $ciTerm, $ciName, $ciYear, $mname, $sname, CURRENT_TIMESTAMP);

-- BLOCK delete_swipes
DELETE FROM swipes WHERE id = $id;

-- BLOCK find_matching_student
SELECT UIN FROM students
WHERE netid = $netid AND ci_term = $ciTerm AND ci_name = $ciName 
AND ci_year = $ciYear;
