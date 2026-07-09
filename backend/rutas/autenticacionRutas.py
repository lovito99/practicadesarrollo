from controladores.autenticacionControlador import iniciarSesion, perfil, registrar


def registrarRutasAutenticacion(app):
    rutaBase = app.config["RUTAAPI"] + "/autenticacion"

    app.post(rutaBase + "/registro")(registrar)
    app.post(rutaBase + "/login")(iniciarSesion)
    app.get(rutaBase + "/perfil")(perfil)
