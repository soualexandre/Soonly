FROM postgres:14.4
COPY docker-entrypoint.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/docker-entrypoint.sh
