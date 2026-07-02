import os

from flask import Flask, jsonify

from conexion.conexionBd import cargarEntorno
from rutas.albumRutas import registrarRutasAlbum

cargarEntorno()


def crearApp():
    app = Flask("servidor")

    registrarRutasAlbum(app)

    @app.after_request
    def permitirCors(respuesta):
        respuesta.headers["Access-Control-Allow-Origin"] = "*"
        respuesta.headers["Access-Control-Allow-Headers"] = "Content-Type"
        respuesta.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return respuesta

    @app.get("/")
    def inicio():
        return jsonify({"ok": True, "mensaje": "API de discos musicales activa."})

    return app


app = crearApp()


def iniciarServidor():
    puerto = int(os.getenv("PUERTO", 5000))
    app.run(host="0.0.0.0", port=puerto, debug=True)


iniciarServidor()
