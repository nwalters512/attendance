CREATE TABLE IF NOT EXISTS sections (
  id       serial,
  name     varchar(80),
  ci_term  char(4),
  ci_name  varchar(80),
  ci_year  smallint,
  CRN      integer,
  PRIMARY KEY (name, ci_term, ci_name, ci_year),
  FOREIGN KEY (ci_term, ci_name, ci_year) REFERENCES course_instances (term, name, year)
);
