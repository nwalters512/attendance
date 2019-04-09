-- BLOCK select_course
SELECT * FROM courses WHERE id = $courseId;

-- BLOCK select_course_instances
SELECT * FROM course_instances WHERE course_name = $course_name;

-- BLOCK insert_course_instance
INSERT INTO course_instances
    (term, name, year, course_name)
VALUES
    ($term, $name, $year, $course_name);

-- BLOCK select_course_join_course_instance
SELECT *, courses.name AS course_name FROM courses LEFT OUTER JOIN course_instances ON (courses.name = course_instances.course_name) WHERE (courses.id = $courseId);

-- BLOCK give_instance_access
INSERT INTO user_assists_course_instance 
  (email, ci_term, ci_name, ci_year)
VALUES
  ($email, $term, $name, $year)
