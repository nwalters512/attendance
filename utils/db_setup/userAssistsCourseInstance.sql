CREATE TABLE IF NOT EXISTS "userAssistsCourseInstance"(
       id       serial,
       email    varchar(80) REFERENCES "User"(email),
       ci_term  char(4),
       ci_name  varchar(80),
       ci_year  smallint,
       PRIMARY KEY(email, ci_term, ci_name, ci_year),
       FOREIGN KEY(ci_term, ci_name, ci_year) REFERENCES "CourseInstance"(term, name, year)
);
