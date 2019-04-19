CREATE TABLE IF NOT EXISTS student_is_in_section (
  id           serial UNIQUE,
  UIN          bigint,
  stu_ci_term  char(6),
  stu_ci_name  varchar(80),
  stu_ci_year  smallint,
  sec_name     varchar(80),
  PRIMARY KEY (UIN, sec_name, stu_ci_term, stu_ci_name, stu_ci_year),
  FOREIGN KEY (UIN, stu_ci_term, stu_ci_name, stu_ci_year) REFERENCES students (UIN, ci_term, ci_name, ci_year) ON DELETE CASCADE,
  FOREIGN KEY (sec_name, stu_ci_term, stu_ci_name, stu_ci_year) REFERENCES sections (name, ci_term, ci_name, ci_year) ON DELETE CASCADE
);
