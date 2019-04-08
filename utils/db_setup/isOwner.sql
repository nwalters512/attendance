CREATE TABLE IF NOT EXISTS is_owner (
  id    serial UNIQUE,
  name  varchar(120) REFERENCES courses (name) ON DELETE CASCADE,
  email varchar(80)  REFERENCES users (email) ON DELETE CASCADE,
  PRIMARY KEY (name, email)
);
