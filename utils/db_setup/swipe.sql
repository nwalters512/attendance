CREATE TABLE IF NOT EXISTS swipes (
  id           serial,
  time         integer,
  UIN          bigint,
  stu_ci_term  char(4),
  stu_ci_name  varchar(80),
  stu_ci_year  smallint,
  meeting_name varchar(80),
  sec_name     varchar(80),
  staff_member varchar(80) REFERENCES users (email),
  PRIMARY KEY (time, UIN, meeting_name, sec_name, staff_member),
  FOREIGN KEY (UIN, stu_ci_term, stu_ci_name, stu_ci_year) REFERENCES students (UIN, ci_term, ci_name, ci_year),
  FOREIGN KEY (meeting_name, sec_name) REFERENCES section_meetings (m_name, s_name)
);
