import os

import psycopg2


def cargarEntorno():
    rutaEnv = os.path.join(os.getcwd(), ".env")
    if not os.path.exists(rutaEnv):
        return

    with open(rutaEnv, encoding="utf-8") as archivo:
        for linea in archivo:
            linea = linea.strip()
            if not linea or linea.startswith("#") or "=" not in linea:
                continue
            clave, valor = linea.split("=", 1)
            os.environ.setdefault(clave.strip(), valor.strip())


cargarEntorno()


def convertirDiccionario(cursor, filas):
    columnas = [columna[0] for columna in cursor.description]
    return [dict(zip(columnas, fila)) for fila in filas]


def obtenerConexion():
    return psycopg2.connect(
        host=os.getenv("DBHOST", "localhost"),
        port=int(os.getenv("DBPUERTO", 5432)),
        user=os.getenv("DBUSUARIO", "root"),
        password=os.getenv("DBCLAVE", ""),
        dbname=os.getenv("DBNOMBRE", "discosmusicales"),
    )
