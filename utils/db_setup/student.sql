CREATE TABLE "Student" (
       UIN             bigserial,
       ci_term         char(4) REFERENCES "CourseInstance"(term),
       ci_name         varchar(80) REFERENCES "CourseInstance"(name),
       ci_year         shortserial REFERENCES "CourseInstance"(year),
       college         varchar(160),
       level           smallserial,
       netid           varchar(40),
       firstName       varchar(80),
       lastName        varchar(80),
       preferredName   varchar(160),
       year            shortserial,
       major           varchar(40),
       credits         shortserial,
       PRIMARY KEY(UIN, ci_term, ci_name, ci_year)
);
