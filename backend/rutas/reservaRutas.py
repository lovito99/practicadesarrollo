from controladores.reservaControlador import (
    cambiarEstadoReserva,
    exportarReporteReservasExcel,
    exportarReporteReservasPdf,
    obtenerReporteReservas,
)


def registrarRutasReserva(app):
    rutaBase = app.config["RUTAAPI"] + app.config["RUTARESERVAS"]

    app.get(rutaBase + "/reporte")(obtenerReporteReservas)
    app.get(rutaBase + "/reporte/excel")(exportarReporteReservasExcel)
    app.get(rutaBase + "/reporte/pdf")(exportarReporteReservasPdf)
    app.patch(rutaBase + "/<int:idReserva>/estado")(cambiarEstadoReserva)
