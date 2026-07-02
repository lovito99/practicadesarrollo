from flask import jsonify, request
from psycopg2 import IntegrityError

from modelos.albumModelo import (
    actualizarAlbum,
    buscarAlbumPorId,
    eliminarAlbum,
    listarAlbumes,
    registrarAlbum,
)


def validarAlbum(datos):
    errores = []

    if not datos:
        return ["El cuerpo de la peticion es obligatorio."]

    if not str(datos.get("tituloAlbum", "")).strip():
        errores.append("El titulo del album es obligatorio.")

    if not datos.get("idArtista"):
        errores.append("El artista es obligatorio.")

    return errores


def obtenerAlbumes():
    try:
        return jsonify({"ok": True, "albumes": listarAlbumes()}), 200
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500


def obtenerAlbumPorId(idAlbum):
    try:
        album = buscarAlbumPorId(idAlbum)
        if not album:
            return jsonify({"ok": False, "mensaje": "Album no encontrado."}), 404
        return jsonify({"ok": True, "album": album}), 200
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500


def crearAlbum():
    datos = request.json
    errores = validarAlbum(datos)

    if errores:
        return jsonify({"ok": False, "errores": errores}), 400

    try:
        idAlbum = registrarAlbum(datos)
        album = buscarAlbumPorId(idAlbum)
        return jsonify({"ok": True, "mensaje": "Album registrado correctamente.", "album": album}), 201
    except IntegrityError:
        return jsonify({"ok": False, "mensaje": "El artista indicado no existe."}), 400
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500


def editarAlbum(idAlbum):
    datos = request.json
    errores = validarAlbum(datos)

    if errores:
        return jsonify({"ok": False, "errores": errores}), 400

    try:
        filasAfectadas = actualizarAlbum(idAlbum, datos)
        if filasAfectadas == 0 and not buscarAlbumPorId(idAlbum):
            return jsonify({"ok": False, "mensaje": "Album no encontrado."}), 404

        album = buscarAlbumPorId(idAlbum)
        return jsonify({"ok": True, "mensaje": "Album actualizado correctamente.", "album": album}), 200
    except IntegrityError:
        return jsonify({"ok": False, "mensaje": "El artista indicado no existe."}), 400
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500


def borrarAlbum(idAlbum):
    try:
        filasAfectadas = eliminarAlbum(idAlbum)
        if filasAfectadas == 0:
            return jsonify({"ok": False, "mensaje": "Album no encontrado."}), 404
        return jsonify({"ok": True, "mensaje": "Album eliminado correctamente."}), 200
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500
