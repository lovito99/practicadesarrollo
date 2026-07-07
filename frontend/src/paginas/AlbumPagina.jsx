import { useEffect, useMemo, useState } from 'react'
import { Music } from 'lucide-react'

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

function normalizarAlbum(album) {
  return {
    tituloAlbum: album.tituloAlbum || '',
    fechaLanzamiento: album.fechaLanzamiento || '',
    genero: album.genero || '',
    idArtista: album.idArtista || '',
  }
}

export default function AlbumPagina() {
  const [albumes, setAlbumes] = useState([])
  const [formulario, setFormulario] = useState(albumVacio)
  const [idEditando, setIdEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [reservas, setReservas] = useState([])
  const [resumenReservas, setResumenReservas] = useState({})
  const [cargandoReservas, setCargandoReservas] = useState(true)
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
    cargarAlbumes()
    cargarReporteReservas()
  }, [])

  function cambiarFormulario(evento) {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
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
      </header>

      {(mensaje || error) && (
        <div className={`alerta ${error ? 'alerta-error' : 'alerta-ok'}`}>
          {error || mensaje}
        </div>
      )}

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
        onActualizar={cargarReporteReservas}
        onExportarPdf={() => exportarReporte('pdf')}
        onExportarExcel={() => exportarReporte('excel')}
      />
    </main>
  )
}
