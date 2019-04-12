-- BLOCK get_linked_students
SELECT * FROM student_is_user
WHERE email = $email;
