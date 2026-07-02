from controladores.albumControlador import (
    borrarAlbum,
    crearAlbum,
    editarAlbum,
    obtenerAlbumPorId,
    obtenerAlbumes,
)


def registrarRutasAlbum(app):
    app.get("/api/albumes")(obtenerAlbumes)
    app.get("/api/albumes/<int:idAlbum>")(obtenerAlbumPorId)
    app.post("/api/albumes")(crearAlbum)
    app.put("/api/albumes/<int:idAlbum>")(editarAlbum)
    app.delete("/api/albumes/<int:idAlbum>")(borrarAlbum)
