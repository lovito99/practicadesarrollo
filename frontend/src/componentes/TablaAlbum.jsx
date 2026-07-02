import { Edit3, Trash2 } from 'lucide-react'

export default function TablaAlbum({ albumes, cargando, onEditar, onEliminar }) {
  return (
    <section className="panel tabla-panel">
      <div className="panel-encabezado">
        <div>
          <p className="etiqueta">Listado</p>
          <h2>Albumes registrados</h2>
        </div>
        <span className="contador">{albumes.length}</span>
      </div>

      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Titulo</th>
              <th>Artista</th>
              <th>Genero</th>
              <th>Lanzamiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" className="estado-tabla">
                  Cargando albumes...
                </td>
              </tr>
            ) : albumes.length === 0 ? (
              <tr>
                <td colSpan="6" className="estado-tabla">
                  No hay albumes registrados.
                </td>
              </tr>
            ) : (
              albumes.map((album) => (
                <tr key={album.idAlbum}>
                  <td>{album.idAlbum}</td>
                  <td>{album.tituloAlbum}</td>
                  <td>{album.nombreArtista || `Artista ${album.idArtista}`}</td>
                  <td>{album.genero || '-'}</td>
                  <td>{album.fechaLanzamiento || '-'}</td>
                  <td>
                    <div className="acciones-tabla">
                      <button type="button" className="boton icono" onClick={() => onEditar(album)} title="Editar album">
                        <Edit3 size={17} />
                      </button>
                      <button
                        type="button"
                        className="boton icono peligro"
                        onClick={() => onEliminar(album.idAlbum)}
                        title="Eliminar album"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
