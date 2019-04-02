#!/usr/bin/env bash

TEMP_DIR="/tmp/psql"

mkdir -p ${TEMP_DIR}

script_dir="${0%/*}"
cp "${script_dir}"/*.sql ${TEMP_DIR}

sudo -i -u postgres sh -c "psql -a -f ${TEMP_DIR}/dropAllTables.sql"
