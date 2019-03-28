-- BLOCK select_courses
SELECT * FROM courses;

-- BLOCK insert_course
INSERT INTO courses
  (name, dept, number)
VALUES
  ($name, $dept, $number);

-- BLOCK delete_course
DELETE FROM courses WHERE id = $id CASCADE;
