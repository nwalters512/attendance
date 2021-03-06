CREATE TABLE IF NOT EXISTS students (
  id              serial UNIQUE,
  UIN             bigint,
  ci_term         char(6),
  ci_name         varchar(80),
  ci_year         smallint,
  college         varchar(160),
  level           char(2),
  netid           varchar(40),
  email           varchar(80),
  firstName       varchar(80),
  lastName        varchar(80),
  preferredName   varchar(160),
  admitTerm       varchar(20),
  major           varchar(40),
  credits         smallint,
  PRIMARY KEY (UIN, ci_term, ci_name, ci_year),
  FOREIGN KEY (ci_term, ci_name, ci_year) REFERENCES course_instances (term, name, year) ON DELETE CASCADE
);
