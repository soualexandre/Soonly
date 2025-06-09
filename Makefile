export COMPOSE_COMMAND        := docker compose
export YML_KAFKA              := docker-compose-kafka.yml
export YML_POSTGRES           := docker-compose-postgres.yml
export YML_REDIS              := docker-compose-redis.yml
export YML_SONAR              := docker-compose-sonar.yml

all: postgres kafka redis
kafka-log:;      ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    logs --follow --tail="all"
kafka-rm:;       ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    down
kafka-rmi:;      ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    down --rmi local
kafka-rmiv:;     ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    down --rmi local --volumes
kafka-start:;    ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    start
kafka-stop:;     ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    stop
kafka:;          ${COMPOSE_COMMAND} --project-name kafka    --file ${YML_KAFKA}    up --build --detach

postgres-log:;   ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} logs --follow --tail="all"
postgres-rm:;    ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} down
postgres-rmi:;   ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} down --rmi local
postgres-rmiv:;  ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} down --rmi local --volumes
postgres-start:; ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} start
postgres-stop:;  ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} stop
postgres:;       ${COMPOSE_COMMAND} --project-name postgres --file ${YML_POSTGRES} up --build --detach
redis-log:;      ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    logs --follow --tail="all"
redis-rm:;       ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    down
redis-rmi:;      ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    down --rmi local
redis-rmiv:;     ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    down --rmi local --volumes
redis-start:;    ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    start
redis-stop:;     ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    stop
redis:;          ${COMPOSE_COMMAND} --project-name redis    --file ${YML_REDIS}    up --build --detach
sonar-log:;      ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    logs --follow --tail="all"
sonar-rm:;       ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    down
sonar-rmi:;      ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    down --rmi local
sonar-rmiv:;     ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    down --rmi local --volumes
sonar-start:;    ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    start
sonar-stop:;     ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    stop
sonar:;          ${COMPOSE_COMMAND} --project-name sonar    --file ${YML_SONAR}    up --build --detach

include databases.mk
export POSTGRES_DATABASES

