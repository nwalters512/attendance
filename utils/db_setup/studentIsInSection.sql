CREATE TABLE "studentIsInSection"(
       id        serial,
       startTime integer,
       UIN       bigint,
       endTime   integer,
       stu_ci_term  char(4),
       stu_ci_name  varchar(80),
       stu_ci_year  smallint,
       stu_email    varchar(80),
       PRIMARY KEY(startTime, UIN),
       FOREIGN KEY(UIN, stu_ci_term, stu_ci_name, stu_ci_year, stu_email) REFERENCES "Student"(UIN, ci_term, ci_name, ci_year, email)
);
