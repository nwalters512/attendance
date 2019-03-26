CREATE TABLE "Course" (
       id             serial,
       name           varchar(120) CONSTRAINT coursekey PRIMARY KEY,
       dept           varchar(60),
       number         smallint
);
