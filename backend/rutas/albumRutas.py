from controladores.albumControlador import (
    borrarAlbum,
    crearAlbum,
    editarAlbum,
    obtenerAlbumPorId,
    obtenerAlbumes,
)


def registrarRutasAlbum(app):
    rutaBase = app.config["RUTAAPI"] + app.config["RUTAALBUMES"]

    app.get(rutaBase)(obtenerAlbumes)
    app.get(rutaBase + "/<int:idAlbum>")(obtenerAlbumPorId)
    app.post(rutaBase)(crearAlbum)
    app.put(rutaBase + "/<int:idAlbum>")(editarAlbum)
    app.delete(rutaBase + "/<int:idAlbum>")(borrarAlbum)
