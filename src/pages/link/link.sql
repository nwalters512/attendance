-- BLOCK get_linked_students_with_info
SELECT * 
FROM
    student_is_user U 
    INNER JOIN 
    course_instances CI 
        ON (U.stu_ci_term = CI.term AND U.stu_ci_name = CI.name AND 
        U.stu_ci_year = CI.year)
    INNER JOIN courses C
        ON (CI.course_name = C.name)

WHERE email = $email;

-- BLOCK unlink_students
DELETE FROM student_is_user
WHERE email = $email;

-- BLOCK link_students
INSERT INTO student_is_user 
    (UIN, stu_ci_term, stu_ci_name, stu_ci_year,email) 
SELECT UIN, ci_term, ci_name, ci_year, $email
FROM students
WHERE UIN = $uin;
