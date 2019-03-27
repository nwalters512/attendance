CREATE TABLE IF NOT EXISTS "isOwner"(
       id    serial,
       name  varchar(120) REFERENCES "Course"(name),
       email varchar(80)  REFERENCES "User"(email),
       PRIMARY KEY(name, email)
);
