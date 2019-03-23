CREATE TABLE "studentIsInSection"(
       start     serial,
       UIN       bigserial REFERENCES "Student"(UIN),
       end       serial,
       PRIMARY KEY(start, UIN)
);
