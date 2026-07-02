\connect postgres

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'discosmusicales'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS discosmusicales WITH (FORCE);
DROP ROLE IF EXISTS discos;

CREATE ROLE discos WITH LOGIN PASSWORD '123456';
CREATE DATABASE discosmusicales OWNER discos;

\connect discosmusicales

GRANT ALL PRIVILEGES ON DATABASE discosmusicales TO discos;
GRANT ALL ON SCHEMA public TO discos;
ALTER SCHEMA public OWNER TO discos;

\ir migraciones/001Inicial.sql
