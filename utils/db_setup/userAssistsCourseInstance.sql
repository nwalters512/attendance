CREATE TABLE IF NOT EXISTS user_assists_course_instance (
  id       serial UNIQUE,
  email    varchar(80) REFERENCES users (email),
  ci_term  char(6),
  ci_name  varchar(80),
  ci_year  smallint,
  PRIMARY KEY (email, ci_term, ci_name, ci_year),
  FOREIGN KEY (ci_term, ci_name, ci_year) REFERENCES course_instances (term, name, year) ON DELETE CASCADE
);
