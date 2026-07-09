import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, LogIn, LogOut, Music, UserPlus } from 'lucide-react'

import FormularioAlbum, { albumVacio } from '../componentes/FormularioAlbum.jsx'
import ReporteReservas from '../componentes/ReporteReservas.jsx'
import TablaAlbum from '../componentes/TablaAlbum.jsx'
import {
  actualizarAlbum,
  eliminarAlbum,
  listarAlbumes,
  registrarAlbum,
} from '../servicios/albumServicio.js'
import {
  descargarReporteReservasExcel,
  descargarReporteReservasPdf,
  obtenerReporteReservas,
} from '../servicios/reservaServicio.js'
import { cerrarSesionGuardada, iniciarSesion, registrarUsuario } from '../servicios/autenticacionServicio.js'

function normalizarAlbum(album) {
  return {
    tituloAlbum: album.tituloAlbum || '',
    fechaLanzamiento: album.fechaLanzamiento || '',
    genero: album.genero || '',
    idArtista: album.idArtista || '',
  }
}

export default function AlbumPagina() {
  const [sesion, setSesion] = useState(null)
  const [formularioSesion, setFormularioSesion] = useState({ nombre: '', correo: '', clave: '' })
  const [registrandoUsuario, setRegistrandoUsuario] = useState(false)
  const [procesandoSesion, setProcesandoSesion] = useState(false)
  const [mostrarClave, setMostrarClave] = useState(false)
  const [albumes, setAlbumes] = useState([])
  const [formulario, setFormulario] = useState(albumVacio)
  const [idEditando, setIdEditando] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [reservas, setReservas] = useState([])
  const [resumenReservas, setResumenReservas] = useState({})
  const [cargandoReservas, setCargandoReservas] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const editando = useMemo(() => idEditando !== null, [idEditando])

  async function cargarAlbumes() {
    setCargando(true)
    setError('')
    try {
      const datos = await listarAlbumes()
      setAlbumes(datos.albumes || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function cargarReporteReservas() {
    if (!sesion?.token) {
      setReservas([])
      setResumenReservas({})
      setCargandoReservas(false)
      return
    }

    setCargandoReservas(true)
    setError('')
    try {
      const datos = await obtenerReporteReservas()
      setReservas(datos.reservas || [])
      setResumenReservas(datos.resumen || {})
    } catch (err) {
      setError(err.message)
    } finally {
      setCargandoReservas(false)
    }
  }

  useEffect(() => {
    cerrarSesionGuardada()
  }, [])

  useEffect(() => {
    if (!sesion?.token) {
      setAlbumes([])
      setReservas([])
      setResumenReservas({})
      setFormulario(albumVacio)
      setIdEditando(null)
      setCargando(false)
      setCargandoReservas(false)
      return
    }

    cargarAlbumes()
    cargarReporteReservas()
  }, [sesion])

  function cambiarFormulario(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  function cambiarFormularioSesion(evento) {
    const { name, value } = evento.target
    setFormularioSesion((actual) => ({ ...actual, [name]: value }))
  }

  async function enviarSesion(evento) {
    evento.preventDefault()
    setProcesandoSesion(true)
    setMensaje('')
    setError('')

    try {
      if (registrandoUsuario) {
        await registrarUsuario(formularioSesion)
        setMensaje('Usuario registrado. Ya puedes iniciar sesion.')
        setRegistrandoUsuario(false)
        setFormularioSesion((actual) => ({ ...actual, nombre: '', clave: '' }))
      } else {
        const datos = await iniciarSesion({
          correo: formularioSesion.correo,
          clave: formularioSesion.clave,
        })
        setSesion({ token: datos.token, usuario: datos.usuario })
        setFormularioSesion({ nombre: '', correo: '', clave: '' })
        setMensaje(`Bienvenido, ${datos.usuario.nombre}.`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setProcesandoSesion(false)
    }
  }

  function cerrarSesion() {
    cerrarSesionGuardada()
    setSesion(null)
    setAlbumes([])
    setReservas([])
    setResumenReservas({})
    setFormulario(albumVacio)
    setIdEditando(null)
    setMensaje('Sesion cerrada correctamente.')
    setError('')
  }

  function cancelarEdicion() {
    setFormulario(albumVacio)
    setIdEditando(null)
    setMensaje('')
  }

  function seleccionarAlbum(album) {
    setFormulario(normalizarAlbum(album))
    setIdEditando(album.idAlbum)
    setMensaje('')
    setError('')
  }

  async function guardarAlbum(evento) {
    evento.preventDefault()
    setGuardando(true)
    setMensaje('')
    setError('')

    const datos = {
      ...formulario,
      idArtista: Number(formulario.idArtista),
    }

    try {
      if (editando) {
        await actualizarAlbum(idEditando, datos)
        setMensaje('Album actualizado correctamente.')
      } else {
        await registrarAlbum(datos)
        setMensaje('Album registrado correctamente.')
      }

      cancelarEdicion()
      await cargarAlbumes()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function borrarAlbum(idAlbum) {
    const confirmado = window.confirm('Deseas eliminar este album?')
    if (!confirmado) return

    setError('')
    setMensaje('')

    try {
      await eliminarAlbum(idAlbum)
      setMensaje('Album eliminado correctamente.')
      await cargarAlbumes()
    } catch (err) {
      setError(err.message)
    }
  }

  async function exportarReporte(tipo) {
    setExportando(true)
    setError('')
    setMensaje('')

    try {
      if (tipo === 'pdf') {
        await descargarReporteReservasPdf()
      } else {
        await descargarReporteReservasExcel()
      }
      setMensaje(`Reporte exportado en ${tipo === 'pdf' ? 'PDF' : 'Excel'}.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setExportando(false)
    }
  }

  return (
    <main className="pagina">
      <header className="cabecera">
        <div className="marca">
          <span className="marca-icono">
            <Music size={28} />
          </span>
          <div>
            <p className="etiqueta">Discos musicales</p>
            <h1>Mantenimiento de albumes</h1>
          </div>
        </div>
        <div className="sesion-panel">
          {sesion?.usuario ? (
            <div className="sesion-activa">
              <span>{sesion.usuario.nombre}</span>
              <button type="button" className="boton" onClick={cerrarSesion}>
                <LogOut size={17} />
                Salir
              </button>
            </div>
          ) : (
            <form className="formulario-sesion" onSubmit={enviarSesion} autoComplete="off">
              {registrandoUsuario && (
                <input
                  type="text"
                  name="nombre"
                  value={formularioSesion.nombre}
                  onChange={cambiarFormularioSesion}
                  placeholder="Nombre"
                  autoComplete="off"
                />
              )}
              <input
                type="email"
                name="correo"
                value={formularioSesion.correo}
                onChange={cambiarFormularioSesion}
                placeholder="Correo"
                autoComplete="off"
              />
              <div className="campo-clave">
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  name="clave"
                  value={formularioSesion.clave}
                  onChange={cambiarFormularioSesion}
                  placeholder="Clave"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="boton-ver-clave"
                  onClick={() => setMostrarClave((actual) => !actual)}
                  title={mostrarClave ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {mostrarClave ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="boton primario" disabled={procesandoSesion}>
                {registrandoUsuario ? <UserPlus size={17} /> : <LogIn size={17} />}
                {registrandoUsuario ? 'Registrar' : 'Entrar'}
              </button>
              <button
                type="button"
                className="boton"
                onClick={() => setRegistrandoUsuario((actual) => !actual)}
                disabled={procesandoSesion}
              >
                {registrandoUsuario ? 'Login' : 'Crear cuenta'}
              </button>
            </form>
          )}
        </div>
      </header>

      {(mensaje || error) && (
        <div className={`alerta ${error ? 'alerta-error' : 'alerta-ok'}`}>
          {error || mensaje}
        </div>
      )}

      {sesion?.token && (
        <>
          <div className="contenido">
            <FormularioAlbum
              album={formulario}
              editando={editando}
              guardando={guardando}
              onCambiar={cambiarFormulario}
              onGuardar={guardarAlbum}
              onCancelar={cancelarEdicion}
            />
            <TablaAlbum albumes={albumes} cargando={cargando} onEditar={seleccionarAlbum} onEliminar={borrarAlbum} />
          </div>

          <ReporteReservas
            reservas={reservas}
            resumen={resumenReservas}
            cargando={cargandoReservas}
            exportando={exportando}
            autenticado={Boolean(sesion?.token)}
            onActualizar={cargarReporteReservas}
            onExportarPdf={() => exportarReporte('pdf')}
            onExportarExcel={() => exportarReporte('excel')}
          />
        </>
      )}
    </main>
  )
}
