CREATE TABLE "studentIsUser"(
       UIN   bigserial REFERENCES "Student"(UIN),
       email varchar(80) REFERENCES "User"(email),
       PRIMARY KEY(UIN)
);
