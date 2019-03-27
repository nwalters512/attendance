CREATE TABLE IF NOT EXISTS is_owner (
  id    serial,
  name  varchar(120) REFERENCES courses (name),
  email varchar(80)  REFERENCES users (email),
  PRIMARY KEY (name, email)
);
