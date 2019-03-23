CREATE TABLE "isCourseInstanceOf"(
       id       serial,
       name     varchar(120) REFERENCES "Course"(name),
       ci_term  char(4) REFERENCES "CourseInstance"(term),
       ci_name  varchar(80) REFERENCES "CourseInstance"(name),
       ci_year  shortserial REFERENCES "CourseInstance"(year),
       PRIMARY KEY(name, ci_term, ci_name, ci_year)
);
