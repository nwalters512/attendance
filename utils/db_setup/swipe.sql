CREATE TABLE "Swipe"(
       id           serial,
       time         integer,
       UIN          bigint,
       stu_ci_term  char(4),
       stu_ci_name  varchar(80),
       stu_ci_year  smallint,
       stu_email    varchar(80),
       meeting_name varchar(80),
       sec_name     varchar(80),
       staff_member varchar(80) REFERENCES "User"(email),
       PRIMARY KEY(time, stu_email, meeting_name, sec_name, staff_member),
       FOREIGN KEY(UIN, stu_ci_term, stu_ci_name, stu_ci_year, stu_email) REFERENCES "Student"(UIN, ci_term, ci_name, ci_year, email),
       FOREIGN KEY(meeting_name, sec_name) REFERENCES "SectionMeeting"(m_name, s_name)
);
