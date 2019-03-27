CREATE TABLE IF NOT EXISTS course_instances (
  id          serial,
  term        char(4),
  name        varchar(80),
  year        smallint,
  course_name varchar(120) REFERENCES courses(name),
  PRIMARY KEY(term, name, year)
);
