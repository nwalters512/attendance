#!/usr/bin/env bash

TEMP_DIR="/tmp/psql"

mkdir -p ${TEMP_DIR}

script_dir="${0%/*}"
cp "${script_dir}"/*.sql ${TEMP_DIR}

sudo -i -u postgres sh -c "psql -a -f ${TEMP_DIR}/dbInit.sql"

# Independent Schemas
indepSchemas=(
    "course.sql"
    "courseInstance.sql"
    "user.sql"
)

# Dependent Schemas
depOneSchemas=(
    "meeting.sql"
    "section.sql"
    "student.sql"
    "isOwner.sql"
    "isCourseInstance.sql"
    "userAssistsCourseInstance.sql"
    "studentIsUser.sql"
    "studentIsInSection.sql"
)

depTwoSchemas=(
    "sectionMeeting.sql"
)

depThreeSchemas=(
    "swipe.sql"
)

schemaArray=(
    "${indepSchemas[@]}"
    "${depOneSchemas[@]}"
    "${depTwoSchemas[@]}"
    "${depThreeSchemas[@]}"
)

if [ $1 = "--db-init-only" ] ; then
    exit
fi

for sql in ${schemaArray[@]}; do
    sudo -i -u postgres sh -c  "psql -U attendance-adm -d attendance -a -f ${TEMP_DIR}/${sql}"
done
