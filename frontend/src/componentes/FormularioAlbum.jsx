import { Save, X } from 'lucide-react'

const albumVacio = {
  tituloAlbum: '',
  fechaLanzamiento: '',
  genero: '',
  idArtista: '',
}

export { albumVacio }

export default function FormularioAlbum({ album, editando, guardando, onCambiar, onGuardar, onCancelar }) {
  return (
    <form className="panel formulario" onSubmit={onGuardar}>
      <div className="panel-encabezado">
        <div>
          <p className="etiqueta">Album</p>
          <h2>{editando ? 'Editar album' : 'Registrar album'}</h2>
        </div>
        {editando && (
          <button type="button" className="boton icono" onClick={onCancelar} title="Cancelar edicion">
            <X size={18} />
          </button>
        )}
      </div>

      <label>
        Titulo
        <input
          name="tituloAlbum"
          value={album.tituloAlbum}
          onChange={onCambiar}
          placeholder="Ej. Discovery"
          required
        />
      </label>

      <label>
        Fecha de lanzamiento
        <input name="fechaLanzamiento" type="date" value={album.fechaLanzamiento || ''} onChange={onCambiar} />
      </label>

      <label>
        Genero
        <input name="genero" value={album.genero || ''} onChange={onCambiar} placeholder="Ej. Rock" />
      </label>

      <label>
        ID artista
        <input
          name="idArtista"
          type="number"
          min="1"
          value={album.idArtista}
          onChange={onCambiar}
          placeholder="Ej. 1"
          required
        />
      </label>

      <div className="acciones-formulario">
        <button type="submit" className="boton primario" disabled={guardando}>
          <Save size={18} />
          {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  )
}
