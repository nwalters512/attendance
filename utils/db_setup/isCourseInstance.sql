CREATE TABLE IF NOT EXISTS "isCourseInstanceOf"(
       id       serial,
       course_name     varchar(120) REFERENCES "Course"(name),
       ci_term  char(4),
       ci_name  varchar(80),
       ci_year  smallint,
       PRIMARY KEY(course_name, ci_term, ci_name, ci_year),
       FOREIGN KEY(ci_term, ci_name, ci_year) REFERENCES "CourseInstance"(term, name, year)
);
