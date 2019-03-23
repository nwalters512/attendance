CREATE TABLE "CourseInstance" (
       id    serial,
       term  char(4) CONSTRAINT ci PRIMARY KEY,
       name  varchar(80) CONSTRAINT ci PRIMARY KEY,
       year  smallint CONSTRAINT ci PRIMARY KEY
);
