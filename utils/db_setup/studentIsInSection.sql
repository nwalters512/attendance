CREATE TABLE IF NOT EXISTS student_is_in_section (
  id        serial,
  startTime integer,
  UIN       bigint,
  endTime   integer,
  stu_ci_term  char(6),
  stu_ci_name  varchar(80),
  stu_ci_year  smallint,
  PRIMARY KEY (startTime, UIN),
  FOREIGN KEY (UIN, stu_ci_term, stu_ci_name, stu_ci_year) REFERENCES students (UIN, ci_term, ci_name, ci_year)
);
