CREATE TABLE "studentIsInSection"(
       id        serial,
       start     integer,
       UIN       bigint REFERENCES "Student"(UIN),
       end       integer,
       PRIMARY KEY(start, UIN)
);
