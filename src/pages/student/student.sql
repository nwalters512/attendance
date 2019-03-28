-- BLOCK select_students
SELECT * FROM students;

-- BLOCK update_student
UPDATE students
SET firstName = ($fName), lastName = ($lName), major = ($major)
WHERE id = $id
