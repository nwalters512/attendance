-- BLOCK select_students
SELECT S.id AS sid, * FROM students S INNER JOIN course_instances CI
    ON (S.ci_name = CI.name AND s.ci_year = CI.year AND s.ci_term = CI.term)
WHERE CI.id = $ciId;


-- BLOCK update_student
UPDATE students
SET firstName = ($fName), lastName = ($lName), netid = ($netid), major = ($major)
WHERE id = $id;
