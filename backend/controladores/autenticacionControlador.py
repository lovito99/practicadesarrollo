from flask import jsonify, request
from psycopg2 import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from modelos.usuarioModelo import buscarUsuarioPorCorreo, buscarUsuarioPorId, registrarUsuario
from seguridad.jwtServicio import crearToken, jwtRequerido


def validarCredenciales(datos, requiereNombre=False):
    errores = []

    if not datos:
        return ["El cuerpo de la peticion es obligatorio."]

    if requiereNombre and not str(datos.get("nombre", "")).strip():
        errores.append("El nombre es obligatorio.")

    if not str(datos.get("correo", "")).strip():
        errores.append("El correo es obligatorio.")

    if not str(datos.get("clave", "")).strip():
        errores.append("La clave es obligatoria.")

    return errores


def registrar():
    datos = request.json or {}
    errores = validarCredenciales(datos, True)
    if errores:
        return jsonify({"ok": False, "errores": errores}), 400

    try:
        idUsuario = registrarUsuario(
            {
                "nombre": datos["nombre"].strip(),
                "correo": datos["correo"].strip().lower(),
                "clave": generate_password_hash(datos["clave"]),
            }
        )
        usuario = buscarUsuarioPorId(idUsuario)
        return jsonify({"ok": True, "mensaje": "Usuario registrado correctamente.", "usuario": usuario}), 201
    except IntegrityError:
        return jsonify({"ok": False, "mensaje": "El correo ya esta registrado."}), 409
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500


def iniciarSesion():
    datos = request.json or {}
    errores = validarCredenciales(datos)
    if errores:
        return jsonify({"ok": False, "errores": errores}), 400

    try:
        usuario = buscarUsuarioPorCorreo(datos["correo"].strip().lower())
        if not usuario or not check_password_hash(usuario["clave"], datos["clave"]):
            return jsonify({"ok": False, "mensaje": "Correo o clave incorrectos."}), 401

        usuario.pop("clave", None)
        return jsonify({"ok": True, "token": crearToken(usuario), "usuario": usuario}), 200
    except Exception as error:
        return jsonify({"ok": False, "mensaje": str(error)}), 500


@jwtRequerido
def perfil():
    return jsonify({"ok": True, "usuario": request.usuario}), 200
