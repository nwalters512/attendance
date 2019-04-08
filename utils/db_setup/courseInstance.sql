CREATE TABLE IF NOT EXISTS course_instances (
  id          serial UNIQUE,
  term        char(6),
  name        varchar(80),
  year        smallint,
  course_name varchar(120) REFERENCES courses(name) ON DELETE CASCADE,
  PRIMARY KEY(term, name, year)
);
