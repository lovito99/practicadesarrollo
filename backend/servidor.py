import os

from flask import Flask, jsonify, request

from conexion.conexionBd import cargarEntorno
from rutas.albumRutas import registrarRutasAlbum
from rutas.autenticacionRutas import registrarRutasAutenticacion
from rutas.reservaRutas import registrarRutasReserva

cargarEntorno()


def crearApp():
    app = Flask("servidor")
    app.config["RUTAAPI"] = os.getenv("RUTAAPI", "/api")
    app.config["RUTAALBUMES"] = os.getenv("RUTAALBUMES", "/albumes")
    app.config["RUTARESERVAS"] = os.getenv("RUTARESERVAS", "/reservas")

    registrarRutasAutenticacion(app)
    registrarRutasAlbum(app)
    registrarRutasReserva(app)

    @app.after_request
    def permitirCors(respuesta):
        origen = request.headers.get("Origin")
        origenPermitido = os.getenv("URLBASEFRONTEND", "*")
        respuesta.headers["Access-Control-Allow-Origin"] = origen or origenPermitido
        respuesta.headers["Vary"] = "Origin"
        respuesta.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        respuesta.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        respuesta.headers["Access-Control-Expose-Headers"] = "Content-Disposition"
        return respuesta

    @app.get("/")
    def inicio():
        return jsonify({"ok": True, "mensaje": "API de discos musicales activa."})

    return app


app = crearApp()


def iniciarServidor():
    puerto = int(os.getenv("PUERTOBACKEND", os.getenv("PUERTO", 5000)))
    app.run(host="0.0.0.0", port=puerto, debug=True)


iniciarServidor()
