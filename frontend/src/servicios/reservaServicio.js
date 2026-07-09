import { obtenerToken } from './autenticacionServicio.js'

const apiUrl = import.meta.env.VITEAPIURL || 'http://localhost:5000/api'

async function solicitar(ruta) {
  const respuesta = await fetch(`${apiUrl}${ruta}`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  })
  const datos = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Ocurrio un error en la solicitud.')
  }

  return datos
}

function obtenerNombreArchivo(respuesta, nombrePorDefecto) {
  const disposicion = respuesta.headers.get('Content-Disposition') || ''
  const coincidencia = disposicion.match(/filename="?([^"]+)"?/)
  return coincidencia?.[1] || nombrePorDefecto
}

async function descargarArchivo(ruta, nombrePorDefecto) {
  const respuesta = await fetch(`${apiUrl}${ruta}`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  })

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}))
    throw new Error(datos.mensaje || 'No se pudo descargar el reporte.')
  }

  const blob = await respuesta.blob()
  const url = window.URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = obtenerNombreArchivo(respuesta, nombrePorDefecto)
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
  window.URL.revokeObjectURL(url)
}

export function obtenerReporteReservas() {
  return solicitar('/reservas/mis-reservas')
}

export function descargarReporteReservasPdf() {
  return descargarArchivo('/reservas/reporte/pdf', 'reporte_reservas.pdf')
}

export function descargarReporteReservasExcel() {
  return descargarArchivo('/reservas/reporte/excel', 'reporte_reservas.xlsx')
}
