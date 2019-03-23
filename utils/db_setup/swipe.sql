CREATE TABLE "Swipe"(
       id           serial,
       time         integer,
       stu_email    varchar(80) REFERENCES "Student"(email),
       meeting_name varchar(80) REFERENCES "SectionMeeting"(m_name),
       sec_name     varchar(80) REFERENCES "SectionMeeting"(s_name),
       staff_member varchar(80) REFERENCES "User"(email),
       PRIMARY KEY(time, stu_email, meeting_name, sec_name, staff_member)
);
