CREATE TABLE "User" (
       email        varchar(80) CONSTRAINT userpk PRIMARY KEY,
       password     varchar(80),
       name         varchar(80),
       netid        varchar(30)
);
