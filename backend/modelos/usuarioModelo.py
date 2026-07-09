from conexion.conexionBd import convertirDiccionario, obtenerConexion


def normalizarUsuario(usuario):
    if usuario:
        usuario.pop("clave", None)
        if usuario.get("fechaCreacion"):
            usuario["fechaCreacion"] = usuario["fechaCreacion"].isoformat()
    return usuario


def buscarUsuarioPorCorreo(correo):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT "idUsuario", nombre, correo, clave, "fechaCreacion"
                FROM usuario
                WHERE correo = %s
                """,
                (correo,),
            )
            usuarios = convertirDiccionario(cursor, cursor.fetchall())
            return usuarios[0] if usuarios else None
    finally:
        conexion.close()


def buscarUsuarioPorId(idUsuario):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT "idUsuario", nombre, correo, "fechaCreacion"
                FROM usuario
                WHERE "idUsuario" = %s
                """,
                (idUsuario,),
            )
            usuarios = convertirDiccionario(cursor, cursor.fetchall())
            return normalizarUsuario(usuarios[0] if usuarios else None)
    finally:
        conexion.close()


def registrarUsuario(datos):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO usuario (nombre, correo, clave)
                VALUES (%s, %s, %s)
                RETURNING "idUsuario"
                """,
                (datos["nombre"], datos["correo"], datos["clave"]),
            )
            idUsuario = cursor.fetchone()[0]
            conexion.commit()
            return idUsuario
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()
