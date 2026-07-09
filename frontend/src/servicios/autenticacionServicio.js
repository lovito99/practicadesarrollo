const apiUrl = import.meta.env.VITEAPIURL || 'http://localhost:5000/api'
const claveSesion = 'sesionDiscosMusicales'

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

export function obtenerSesionGuardada() {
  const sesion = window.localStorage.getItem(claveSesion)
  return sesion ? JSON.parse(sesion) : null
}

export function guardarSesion(sesion) {
  window.localStorage.setItem(claveSesion, JSON.stringify(sesion))
}

export function cerrarSesionGuardada() {
  window.localStorage.removeItem(claveSesion)
}

export function obtenerToken() {
  return obtenerSesionGuardada()?.token || ''
}

export async function iniciarSesion(credenciales) {
  const datos = await solicitar('/autenticacion/login', {
    method: 'POST',
    body: JSON.stringify(credenciales),
  })
  guardarSesion({ token: datos.token, usuario: datos.usuario })
  return datos
}

export async function registrarUsuario(usuario) {
  return solicitar('/autenticacion/registro', {
    method: 'POST',
    body: JSON.stringify(usuario),
  })
}
