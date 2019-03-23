CREATE TABLE "studentIsUser"(
       id    serial,
       UIN   bigserial REFERENCES "Student"(UIN),
       email varchar(80) REFERENCES "User"(email),
       PRIMARY KEY(UIN)
);
