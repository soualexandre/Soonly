#!/bin/sh

f_create_database() {
psql -v ON_ERROR_STOP=1 --username "${POSTGRES_USER}" << EOF
    CREATE USER ${1};
    CREATE DATABASE ${1};
    GRANT ALL PRIVILEGES ON DATABASE ${1} TO ${1};
EOF
}

for POSTGRES_DATABASE in ${POSTGRES_DATABASES}
do
    echo "● ${POSTGRES_DATABASE}" | tr '[:lower:]' '[:upper:]'
    f_create_database "${POSTGRES_DATABASE}"
done
