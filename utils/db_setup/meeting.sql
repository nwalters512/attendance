CREATE TABLE "Meeting" (
       id       serial,
       name     varchar(80),
       ci_term  char(4) REFERENCES "CourseInstance"(term),
       ci_name  varchar(80) REFERENCES "CourseInstance"(name),
       ci_year  smallint REFERENCES "CourseInstance"(year),
       PRIMARY KEY(name, ci_term, ci_name, ci_year)
);
