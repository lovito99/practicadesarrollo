import os

from flask import Flask, jsonify

from conexion.conexionBd import cargarEntorno
from rutas.albumRutas import registrarRutasAlbum
from rutas.reservaRutas import registrarRutasReserva

cargarEntorno()


def crearApp():
    app = Flask("servidor")
    app.config["RUTAAPI"] = os.getenv("RUTAAPI", "/api")
    app.config["RUTAALBUMES"] = os.getenv("RUTAALBUMES", "/albumes")
    app.config["RUTARESERVAS"] = os.getenv("RUTARESERVAS", "/reservas")

    registrarRutasAlbum(app)
    registrarRutasReserva(app)

    @app.after_request
    def permitirCors(respuesta):
        respuesta.headers["Access-Control-Allow-Origin"] = os.getenv("URLBASEFRONTEND", "*")
        respuesta.headers["Access-Control-Allow-Headers"] = "Content-Type"
        respuesta.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
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
