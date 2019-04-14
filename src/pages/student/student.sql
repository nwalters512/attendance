-- BLOCK select_students
SELECT * FROM students;

-- BLOCK update_student
UPDATE students
SET firstName = ($fName), lastName = ($lName), netid = ($netid), major = ($major)
WHERE id = $id

-- BLOCK insert_update_roster
/* INSERT INTO students ()
SELECT * FROM UNNEST ()
ON CONFLICT () DO UPDATE
    SET
*/ 
