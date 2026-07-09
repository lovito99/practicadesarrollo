from conexion.conexionBd import convertirDiccionario, obtenerConexion


def normalizarReserva(reserva):
    for campo in ("fechaReserva", "fechaEvento"):
        if reserva and reserva.get(campo):
            reserva[campo] = reserva[campo].isoformat()

    if reserva and reserva.get("montoTotal") is not None:
        reserva["montoTotal"] = float(reserva["montoTotal"])

    return reserva


def listarReporteReservas(idUsuario=None):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            filtroUsuario = ""
            parametros = ()
            if idUsuario is not None:
                filtroUsuario = 'WHERE r."idUsuario" = %s'
                parametros = (idUsuario,)

            cursor.execute(
                f"""
                SELECT
                    r."idReserva",
                    r."cliente",
                    r."correoCliente",
                    r."fechaReserva",
                    r."fechaEvento",
                    r."cantidad",
                    r."estado",
                    r."montoTotal",
                    r."idUsuario",
                    a."tituloAlbum",
                    ar."nombreArtista"
                FROM reserva r
                INNER JOIN album a ON a."idAlbum" = r."idAlbum"
                INNER JOIN artista ar ON ar."idArtista" = a."idArtista"
                {filtroUsuario}
                ORDER BY r."fechaReserva" DESC, r."idReserva" DESC
                """,
                parametros,
            )
            reservas = convertirDiccionario(cursor, cursor.fetchall())
            return [normalizarReserva(reserva) for reserva in reservas]
    finally:
        conexion.close()


def buscarReservaPorId(idReserva, idUsuario=None):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            filtroUsuario = ""
            parametros = [idReserva]
            if idUsuario is not None:
                filtroUsuario = 'AND r."idUsuario" = %s'
                parametros.append(idUsuario)

            cursor.execute(
                f"""
                SELECT
                    r."idReserva",
                    r."cliente",
                    r."correoCliente",
                    r."fechaReserva",
                    r."fechaEvento",
                    r."cantidad",
                    r."estado",
                    r."montoTotal",
                    r."idUsuario",
                    a."tituloAlbum",
                    ar."nombreArtista"
                FROM reserva r
                INNER JOIN album a ON a."idAlbum" = r."idAlbum"
                INNER JOIN artista ar ON ar."idArtista" = a."idArtista"
                WHERE r."idReserva" = %s
                {filtroUsuario}
                """,
                tuple(parametros),
            )
            reservas = convertirDiccionario(cursor, cursor.fetchall())
            return normalizarReserva(reservas[0] if reservas else None)
    finally:
        conexion.close()


def actualizarEstadoReserva(idReserva, estado, idUsuario=None):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            filtroUsuario = ""
            parametros = [estado, idReserva]
            if idUsuario is not None:
                filtroUsuario = 'AND "idUsuario" = %s'
                parametros.append(idUsuario)

            cursor.execute(
                f"""
                UPDATE reserva
                SET estado = %s
                WHERE "idReserva" = %s
                {filtroUsuario}
                """,
                tuple(parametros),
            )
            conexion.commit()
            return cursor.rowcount
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()
