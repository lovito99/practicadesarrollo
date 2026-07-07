import { Download, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react'

function formatearMonto(valor) {
  return Number(valor || 0).toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
  })
}

export default function ReporteReservas({
  reservas,
  resumen,
  cargando,
  exportando,
  onActualizar,
  onExportarExcel,
  onExportarPdf,
}) {
  return (
    <section className="panel reporte-panel">
      <div className="panel-encabezado reporte-encabezado">
        <div>
          <p className="etiqueta">Reporte</p>
          <h2>Reservas realizadas</h2>
        </div>
        <div className="acciones-reporte">
          <button type="button" className="boton icono" onClick={onActualizar} disabled={cargando} title="Actualizar">
            <RefreshCw size={17} />
          </button>
          <button type="button" className="boton" onClick={onExportarPdf} disabled={exportando}>
            <FileText size={18} />
            PDF
          </button>
          <button type="button" className="boton primario" onClick={onExportarExcel} disabled={exportando}>
            <FileSpreadsheet size={18} />
            Excel
          </button>
        </div>
      </div>

      <div className="resumen-reporte">
        <div className="metrica">
          <span>Reservas</span>
          <strong>{resumen.totalReservas || 0}</strong>
        </div>
        <div className="metrica">
          <span>Entradas</span>
          <strong>{resumen.totalEntradas || 0}</strong>
        </div>
        <div className="metrica">
          <span>Importe</span>
          <strong>{formatearMonto(resumen.totalImporte)}</strong>
        </div>
      </div>

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Album</th>
              <th>Artista</th>
              <th>Reserva</th>
              <th>Evento</th>
              <th>Cant.</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="10" className="estado-tabla">
                  Cargando reservas...
                </td>
              </tr>
            ) : reservas.length === 0 ? (
              <tr>
                <td colSpan="10" className="estado-tabla">
                  No hay reservas realizadas.
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.idReserva}>
                  <td>{reserva.idReserva}</td>
                  <td>{reserva.cliente}</td>
                  <td>{reserva.correoCliente || '-'}</td>
                  <td>{reserva.tituloAlbum}</td>
                  <td>{reserva.nombreArtista}</td>
                  <td>{reserva.fechaReserva || '-'}</td>
                  <td>{reserva.fechaEvento || '-'}</td>
                  <td>{reserva.cantidad}</td>
                  <td>
                    <span className={`estado estado-${String(reserva.estado || '').toLowerCase()}`}>
                      {reserva.estado}
                    </span>
                  </td>
                  <td>{formatearMonto(reserva.montoTotal)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="nota-reporte">
        <Download size={16} />
        <span>Exporta el mismo reporte en PDF o Excel desde los botones superiores.</span>
      </div>
    </section>
  )
}
