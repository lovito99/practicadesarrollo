DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'discos') THEN
    CREATE ROLE discos WITH LOGIN PASSWORD '123456';
  ELSE
    ALTER ROLE discos WITH PASSWORD '123456';
  END IF;
END
$$;

SELECT 'CREATE DATABASE discosmusicales OWNER discos'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'discosmusicales'
)\gexec

\connect discosmusicales

GRANT ALL PRIVILEGES ON DATABASE discosmusicales TO discos;
GRANT ALL ON SCHEMA public TO discos;
ALTER SCHEMA public OWNER TO discos;
