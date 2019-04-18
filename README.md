# Attendance@Illinois

An app to track attendance at UIUC

## Preparing to Deploy/Run the Project

Order of Instructions To Be Read for Setting Up The Project

1. DB Installation And Useful Utilities
1. Starting Up The Postgres Server
1. DB Setup And Configuration
1. Running the Webserver
1. Running the Webserver in Production Mode for Heroku

## DB Installation And Useful Utilities

Support will be ranged from Tier 1 - 3, where Tier 1 has the greatest support and Tier 3 has minimal testing at the time of writing this document. Feel free to update information on this if using any environments listed below or an unlisted environment.

### Tier 1
* Arch Linux
* Ubuntu

### Tier 2
* Native Windows Postgres Installs

### Tier 3
* Mac OS (due to unknown behavior of brew formula)

### Install Instructions for Postgres

Arch Linux install instructions can be found [here](https://wiki.archlinux.org/index.php/PostgreSQL).

For Ubuntu users wanting to host a database in the Ubuntu environment

```
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Windows user can find the installer from [here](https://www.postgresql.org/download/windows/).

Mac users can either use a `brew` package (which does not setup a `postgres` user needed by the setup scripts in this repository) or use the installer [here](https://www.postgresql.org/download/macosx/).

## Starting Up The Postgres Server

### For users with `systemctl`

To start `postgresql`,

```
sudo systemctl start postgresql.service
```

To enable the database on boot,

```
sudo systemctl enable postgresql.service
```

### Windows Users

TODO

### Mac Users

TODO

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

To populate the newly created database with tables, simply run the webapp as explained in `Running the Webserver`.

### Util Scripts

If you need to drop all tables due to a schema change or any other reason, execute `utils/db_utils/dropAllTables.sh`.

## Running the Webserver

* Clone this repository to your computer
* Run `npm install` in the newly-cloned directory
* Run `npm run dev**
* Go to http://localhost:3000 in your browser to see the application

## Running the Webserver in Production Mode for Heroku

**Note:** there should be no need to do this manually since the Travis CI config `.travis.yml` will 

* Similar to the instructions in `Running the Webserver` except the following two points
* Run `npm start` instead of `npm run dev`
* The port on heroku will be port 80 instead of port 3000

## Useful Utilities and Resources

* [psql Guide](http://postgresguide.com/utilities/psql.html)
* [Datagrip](https://www.jetbrains.com/datagrip/) Can be used to back up database instances and import CSVs
* [ESLint in vim](https://medium.com/usevim/in-editor-linting-with-syntastic-6814122bdbec)
* [Travis CI Heroku Deployment](https://docs.travis-ci.com/user/deployment/heroku/)
* [Travis CI Node Setup](https://docs.travis-ci.com/user/languages/javascript-with-nodejs/)
