const apiUrl = import.meta.env.VITEAPIURL || 'http://localhost:5000/api'

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${apiUrl}${ruta}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
    ...opciones,
  })

  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    const mensaje = datos.mensaje || datos.errores?.join(' ') || 'Ocurrio un error en la solicitud.'
    throw new Error(mensaje)
  }

  return datos
}

export function listarAlbumes() {
  return solicitar('/albumes')
}

export function buscarAlbumPorId(idAlbum) {
  return solicitar(`/albumes/${idAlbum}`)
}

export function registrarAlbum(album) {
  return solicitar('/albumes', {
    method: 'POST',
    body: JSON.stringify(album),
  })
}

export function actualizarAlbum(idAlbum, album) {
  return solicitar(`/albumes/${idAlbum}`, {
    method: 'PUT',
    body: JSON.stringify(album),
  })
}

export function eliminarAlbum(idAlbum) {
  return solicitar(`/albumes/${idAlbum}`, {
    method: 'DELETE',
  })
}
