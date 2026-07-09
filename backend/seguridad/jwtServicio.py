import os
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import jsonify, request

from modelos.usuarioModelo import buscarUsuarioPorId


def crearToken(usuario):
    ahora = datetime.now(timezone.utc)
    payload = {
        "sub": str(usuario["idUsuario"]),
        "nombre": usuario["nombre"],
        "correo": usuario["correo"],
        "iat": ahora,
        "exp": ahora + timedelta(hours=int(os.getenv("JWTHORAS", "8"))),
    }
    return jwt.encode(payload, os.getenv("JWTSECRETO", "cambia-este-secreto"), algorithm="HS256")


def obtenerPayloadToken():
    encabezado = request.headers.get("Authorization", "")
    if not encabezado.startswith("Bearer "):
        return None, "Token no enviado."

    token = encabezado.removeprefix("Bearer ").strip()
    try:
        return jwt.decode(token, os.getenv("JWTSECRETO", "cambia-este-secreto"), algorithms=["HS256"]), None
    except jwt.ExpiredSignatureError:
        return None, "La sesion expiro. Inicia sesion nuevamente."
    except jwt.InvalidTokenError:
        return None, "Token invalido."


def jwtRequerido(funcion):
    @wraps(funcion)
    def envoltura(*args, **kwargs):
        payload, error = obtenerPayloadToken()
        if error:
            return jsonify({"ok": False, "mensaje": error}), 401

        usuario = buscarUsuarioPorId(payload.get("sub"))
        if not usuario:
            return jsonify({"ok": False, "mensaje": "Usuario no encontrado."}), 401

        request.usuario = usuario
        return funcion(*args, **kwargs)

    return envoltura
