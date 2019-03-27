CREATE TABLE IF NOT EXISTS is_course_instance_of (
  id       serial,
  course_name     varchar(120) REFERENCES courses (name),
  ci_term  char(4),
  ci_name  varchar(80),
  ci_year  smallint,
  PRIMARY KEY (course_name, ci_term, ci_name, ci_year),
  FOREIGN KEY (ci_term, ci_name, ci_year) REFERENCES course_instances (term, name, year)
);
