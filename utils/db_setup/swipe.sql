CREATE TABLE IF NOT EXISTS swipes (
  id           serial UNIQUE,
  UIN          bigint,
  stu_ci_term  char(6),
  stu_ci_name  varchar(80),
  stu_ci_year  smallint,
  meeting_name varchar(80),
  sec_name     varchar(80),
  PRIMARY KEY (UIN, meeting_name, sec_name),
  FOREIGN KEY (UIN, stu_ci_term, stu_ci_name, stu_ci_year) REFERENCES students (UIN, ci_term, ci_name, ci_year) ON DELETE CASCADE,
  FOREIGN KEY (meeting_name, sec_name) REFERENCES section_meetings (m_name, s_name) ON DELETE CASCADE
);
