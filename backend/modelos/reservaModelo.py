from conexion.conexionBd import convertirDiccionario, obtenerConexion


def normalizarReserva(reserva):
    for campo in ("fechaReserva", "fechaEvento"):
        if reserva and reserva.get(campo):
            reserva[campo] = reserva[campo].isoformat()

    if reserva and reserva.get("montoTotal") is not None:
        reserva["montoTotal"] = float(reserva["montoTotal"])

    return reserva


def listarReporteReservas():
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    r."idReserva",
                    r."cliente",
                    r."correoCliente",
                    r."fechaReserva",
                    r."fechaEvento",
                    r."cantidad",
                    r."estado",
                    r."montoTotal",
                    a."tituloAlbum",
                    ar."nombreArtista"
                FROM reserva r
                INNER JOIN album a ON a."idAlbum" = r."idAlbum"
                INNER JOIN artista ar ON ar."idArtista" = a."idArtista"
                ORDER BY r."fechaReserva" DESC, r."idReserva" DESC
                """
            )
            reservas = convertirDiccionario(cursor, cursor.fetchall())
            return [normalizarReserva(reserva) for reserva in reservas]
    finally:
        conexion.close()


def buscarReservaPorId(idReserva):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    r."idReserva",
                    r."cliente",
                    r."correoCliente",
                    r."fechaReserva",
                    r."fechaEvento",
                    r."cantidad",
                    r."estado",
                    r."montoTotal",
                    a."tituloAlbum",
                    ar."nombreArtista"
                FROM reserva r
                INNER JOIN album a ON a."idAlbum" = r."idAlbum"
                INNER JOIN artista ar ON ar."idArtista" = a."idArtista"
                WHERE r."idReserva" = %s
                """,
                (idReserva,),
            )
            reservas = convertirDiccionario(cursor, cursor.fetchall())
            return normalizarReserva(reservas[0] if reservas else None)
    finally:
        conexion.close()


def actualizarEstadoReserva(idReserva, estado):
    conexion = obtenerConexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute(
                """
                UPDATE reserva
                SET estado = %s
                WHERE "idReserva" = %s
                """,
                (estado, idReserva),
            )
            conexion.commit()
            return cursor.rowcount
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()
