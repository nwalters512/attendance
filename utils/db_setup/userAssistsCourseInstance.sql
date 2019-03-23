CREATE TABLE "userAssistsCourseInstance"(
       id       serial,
       email    varchar(80) REFERENCES "User"(email),
       ci_term  char(4) REFERENCES "CourseInstance"(term),
       ci_name  varchar(80) REFERENCES "CourseInstance"(name),
       ci_year  smallint REFERENCES "CourseInstance"(year),
       PRIMARY KEY(email, ci_term, ci_name, ci_year)
);
