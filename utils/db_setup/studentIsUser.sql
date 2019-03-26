CREATE TABLE "studentIsUser"(
       id           serial,
       UIN          bigint,
       stu_ci_term  char(4),
       stu_ci_name  varchar(80),
       stu_ci_year  smallint,
       stu_email    varchar(80),
       email        varchar(80) REFERENCES "User"(email),
       PRIMARY KEY(UIN),
       FOREIGN KEY(UIN, stu_ci_term, stu_ci_name, stu_ci_year, stu_email) REFERENCES "Student"(UIN, ci_term, ci_name, ci_year, email)
);
