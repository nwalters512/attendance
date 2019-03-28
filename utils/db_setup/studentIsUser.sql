CREATE TABLE IF NOT EXISTS student_is_user (
  id           serial,
  UIN          bigint,
  stu_ci_term  char(6),
  stu_ci_name  varchar(80),
  stu_ci_year  smallint,
  email        varchar(80) REFERENCES users (email),
  PRIMARY KEY (UIN),
  FOREIGN KEY (UIN, stu_ci_term, stu_ci_name, stu_ci_year) REFERENCES students (UIN, ci_term, ci_name, ci_year)
);
