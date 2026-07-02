from conexion.conexionBd import convertirDiccionario, obtenerConexion


def normalizarAlbum(album):
    if album and album.get("fechaLanzamiento"):
        album["fechaLanzamiento"] = album["fechaLanzamiento"].isoformat()
    return album


def listarAlbumes():
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    a."idAlbum",
                    a."tituloAlbum",
                    a."fechaLanzamiento",
                    a.genero,
                    a."idArtista",
                    ar."nombreArtista"
                FROM album a
                INNER JOIN artista ar ON ar."idArtista" = a."idArtista"
                ORDER BY a."idAlbum" DESC
                """
            )
            albumes = convertirDiccionario(cursor, cursor.fetchall())
            return [normalizarAlbum(album) for album in albumes]
    finally:
        conexion.close()


def buscarAlbumPorId(idAlbum):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    a."idAlbum",
                    a."tituloAlbum",
                    a."fechaLanzamiento",
                    a.genero,
                    a."idArtista",
                    ar."nombreArtista"
                FROM album a
                INNER JOIN artista ar ON ar."idArtista" = a."idArtista"
                WHERE a."idAlbum" = %s
                """,
                (idAlbum,),
            )
            albumes = convertirDiccionario(cursor, cursor.fetchall())
            return normalizarAlbum(albumes[0] if albumes else None)
    finally:
        conexion.close()


def registrarAlbum(album):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
                VALUES (%s, %s, %s, %s)
                RETURNING "idAlbum"
                """,
                (
                    album["tituloAlbum"],
                    album.get("fechaLanzamiento") or None,
                    album.get("genero") or None,
                    album["idArtista"],
                ),
            )
            idAlbum = cursor.fetchone()[0]
            conexion.commit()
            return idAlbum
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()


def actualizarAlbum(idAlbum, album):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                UPDATE album
                SET "tituloAlbum" = %s,
                    "fechaLanzamiento" = %s,
                    genero = %s,
                    "idArtista" = %s,
                    "fechaActualizacion" = now()
                WHERE "idAlbum" = %s
                """,
                (
                    album["tituloAlbum"],
                    album.get("fechaLanzamiento") or None,
                    album.get("genero") or None,
                    album["idArtista"],
                    idAlbum,
                ),
            )
            conexion.commit()
            return cursor.rowcount
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()


def eliminarAlbum(idAlbum):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute('DELETE FROM album WHERE "idAlbum" = %s', (idAlbum,))
            conexion.commit()
            return cursor.rowcount
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()
