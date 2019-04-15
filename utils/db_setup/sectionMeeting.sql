CREATE TABLE IF NOT EXISTS section_meetings (
  id                     serial UNIQUE,
  m_name                 varchar(80),
  m_ci_term              char(6),
  m_ci_name              varchar(80),
  m_ci_year              smallint,
  s_name                 varchar(80),
  s_ci_term              char(6),
  s_ci_name              varchar(80),
  s_ci_year              smallint,
  PRIMARY KEY (m_name, s_name, s_ci_term, s_ci_name, s_ci_year),
  FOREIGN KEY (m_name, m_ci_term, m_ci_name, m_ci_year) REFERENCES meetings (name, ci_term, ci_name, ci_year) ON DELETE CASCADE,
  FOREIGN KEY (s_name, s_ci_term, s_ci_name, s_ci_year) REFERENCES sections (name, ci_term, ci_name, ci_year) ON DELETE CASCADE
);
