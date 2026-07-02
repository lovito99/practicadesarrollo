#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f backend/.env ]; then
  echo "No existe backend/.env"
  echo "Copia backend/.env.example a backend/.env y vuelve a ejecutar."
  exit 1
fi

set -a
. backend/.env
set +a

echo "Recreando base de datos en PostgreSQL..."
echo "Puerto: ${DBPUERTO}"
echo "Base: ${DBNOMBRE}"
echo "Usuario app: ${DBUSUARIO}"

if docker ps --format '{{.Names}}' | grep -qx 'discosmusicales_postgres'; then
  echo "Usando contenedor Docker: discosmusicales_postgres"
  docker exec -e PGPASSWORD="${DBCLAVE}" discosmusicales_postgres \
    psql -U "${DBUSUARIO}" -d "${DBNOMBRE}" \
    -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO ${DBUSUARIO};"
  docker cp backend/baseDatos.sql discosmusicales_postgres:/tmp/baseDatos.sql
  docker exec -e PGPASSWORD="${DBCLAVE}" discosmusicales_postgres \
    psql -U "${DBUSUARIO}" -d "${DBNOMBRE}" -f /tmp/baseDatos.sql
else
  echo "No se encontro el contenedor discosmusicales_postgres."
  echo "Crealo con:"
  echo "docker run -d --name discosmusicales_postgres -e POSTGRES_USER=${DBUSUARIO} -e POSTGRES_PASSWORD=${DBCLAVE} -e POSTGRES_DB=${DBNOMBRE} -p ${DBPUERTO}:5432 postgres:16-alpine"
  exit 1
fi

echo "Verificando conexion con usuario de la aplicacion..."
PGPASSWORD="${DBCLAVE}" psql \
  -h "${DBHOST}" \
  -p "${DBPUERTO}" \
  -U "${DBUSUARIO}" \
  -d "${DBNOMBRE}" \
  -c "SELECT current_user, current_database();"

echo "Verificando tablas..."
PGPASSWORD="${DBCLAVE}" psql \
  -h "${DBHOST}" \
  -p "${DBPUERTO}" \
  -U "${DBUSUARIO}" \
  -d "${DBNOMBRE}" \
  -c "\\dt"

echo "Verificando albumes de prueba..."
PGPASSWORD="${DBCLAVE}" psql \
  -h "${DBHOST}" \
  -p "${DBPUERTO}" \
  -U "${DBUSUARIO}" \
  -d "${DBNOMBRE}" \
  -c 'SELECT COUNT(*) AS totalAlbumes FROM album;'

echo "Base de datos recreada y migrada correctamente."
