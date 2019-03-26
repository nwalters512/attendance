CREATE TABLE "CourseInstance" (
       id    serial,
       term  char(4),
       name  varchar(80),
       year  smallint,
       PRIMARY KEY(term, name, year)
);
