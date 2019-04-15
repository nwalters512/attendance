CREATE TABLE IF NOT EXISTS section_meetings (
  id                     serial UNIQUE,
  m_name                 varchar(80),
  ci_term              char(6),
  ci_name              varchar(80),
  ci_year              smallint,
  s_name                 varchar(80),
  PRIMARY KEY (m_name, s_name, ci_term, ci_name, ci_year),
  FOREIGN KEY (m_name, ci_term, ci_name, ci_year) REFERENCES meetings (name, ci_term, ci_name, ci_year) ON DELETE CASCADE,
  FOREIGN KEY (s_name, ci_term, ci_name, ci_year) REFERENCES sections (name, ci_term, ci_name, ci_year) ON DELETE CASCADE
);
