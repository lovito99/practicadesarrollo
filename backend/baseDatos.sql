SELECT 'CREATE DATABASE discosmusicales'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'discosmusicales'
)\gexec

\connect discosmusicales

\ir migraciones/001Inicial.sql
