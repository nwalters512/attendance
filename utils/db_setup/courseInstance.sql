CREATE TABLE "CourseInstance" (
       term  char(4) CONSTRAINT ci PRIMARY KEY,
       name  varchar(80) CONSTRAINT ci PRIMARY KEY,
       year  shortserial CONSTRAINT ci PRIMARY KEY
);
