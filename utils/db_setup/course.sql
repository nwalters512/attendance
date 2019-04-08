CREATE TABLE IF NOT EXISTS courses (
  id             serial UNIQUE,
  name           varchar(120) CONSTRAINT coursekey PRIMARY KEY,
  dept           varchar(60),
  number         smallint
);
