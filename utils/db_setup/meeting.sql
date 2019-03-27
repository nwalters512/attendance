CREATE TABLE IF NOT EXISTS "Meeting" (
       id       serial,
       name     varchar(80),
       ci_term  char(4),
       ci_name  varchar(80),
       ci_year  smallint,
       PRIMARY KEY(name, ci_term, ci_name, ci_year),
       FOREIGN KEY(ci_term, ci_name, ci_year) REFERENCES "CourseInstance"(term, name, year)
);
