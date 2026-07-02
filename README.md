# Discos Musicales

Proyecto de mantenimiento de albumes con backend en Python Flask, frontend en React y base de datos PostgreSQL.

## Backend

1. Crear la base de datos ejecutando `backend/baseDatos.sql` en PostgreSQL.
2. Revisar las credenciales en `backend/.env`.
3. Instalar dependencias:

```bash
cd backend
pip install -r requirements.txt
```

4. Iniciar el servidor:

```bash
python servidor.py
```

La API queda disponible en `http://localhost:5000/api`.

## Frontend

1. Revisar la URL del backend en `frontend/.env`.
2. Instalar dependencias:

```bash
cd frontend
npm install
```

3. Iniciar React:

```bash
npm run dev
```

## Rutas Del Album

- `GET /api/albumes`
- `GET /api/albumes/<idAlbum>`
- `POST /api/albumes`
- `PUT /api/albumes/<idAlbum>`
- `DELETE /api/albumes/<idAlbum>`
