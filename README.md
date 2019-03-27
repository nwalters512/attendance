# Attendance@Illinois

An app to track attendance at UIUC

## Getting started

* Clone this repository to your computer
* Run `npm install` in the newly-cloned directory
* Run `npm run dev`
* Go to http://localhost:3000 in your browser to see the application

## DB Setup And Configuration

### Setup Script

If setting up on an install of `postgresql` that has a `postgres` user, can simple execute `utils/db_setup/psqlInit.sh`

### Manual Setup

If not, simply execute `utils/db_setup/dbInit.sql` using the `psql` client.

For example,

```
psql <normal-postgres-args> -a -f utils/db_setup/dbInit.sql
```

Example of `<normal-postgres-args>`

```
-U attendance-adm -d attendance
```

To populate the newly created database with tables, simply run the webapp as explained in `Getting Started`.
