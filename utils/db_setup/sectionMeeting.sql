CREATE TABLE "SectionMeeting" (
       id                     serial,
       m_name                 varchar(80),
       m_ci_term              char(4),
       m_ci_name              varchar(80),
       m_ci_year              smallint,
       s_name                 varchar(80),
       s_ci_term              char(4),
       s_ci_name              varchar(80),
       s_ci_year              smallint,
       PRIMARY KEY(m_name, s_name),
       FOREIGN KEY(m_name, m_ci_term, m_ci_name, m_ci_year) REFERENCES "Meeting"(name, ci_term, ci_name, ci_year),
       FOREIGN KEY(s_name, s_ci_term, s_ci_name, s_ci_year) REFERENCES "Section"(name, ci_term, ci_name, ci_year)
);
