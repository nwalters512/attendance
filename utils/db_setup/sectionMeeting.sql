CREATE TABLE "SectionMeeting" (
       m_name                 varchar(80) REFERENCES "Meeting"(name),
       s_name                 varchar(80) REFERENCES "Section"(name),
       PRIMARY KEY(m_name, s_name)
);
