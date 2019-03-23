CREATE TABLE "Student" (
       id              serial,
       UIN             bigint,
       ci_term         char(4) REFERENCES "CourseInstance"(term),
       ci_name         varchar(80) REFERENCES "CourseInstance"(name),
       ci_year         smallint REFERENCES "CourseInstance"(year),
       college         varchar(160),
       level           smallint,
       netid           varchar(40),
       email           varchar(80),
       firstName       varchar(80),
       lastName        varchar(80),
       preferredName   varchar(160),
       year            smallint,
       major           varchar(40),
       credits         smallint,
       PRIMARY KEY(UIN, ci_term, ci_name, ci_year)
);
