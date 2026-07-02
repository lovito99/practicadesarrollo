# Discos Musicales

Aplicacion de mantenimiento de albumes musicales.

Tecnologias usadas:

- Backend: Python, Flask y PostgreSQL
- Frontend: React con Vite
- Base de datos: PostgreSQL

## Estructura Del Proyecto

```text
.
├── README.md
├── backend
│   ├── baseDatos.sql
│   ├── .env
│   ├── requirements.txt
│   ├── servidor.py
│   ├── conexion
│   │   └── conexionBd.py
│   ├── controladores
│   │   └── albumControlador.py
│   ├── modelos
│   │   └── albumModelo.py
│   ├── migraciones
│   │   └── 001Inicial.sql
│   └── rutas
│       └── albumRutas.py
└── frontend
    ├── .env
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── main.jsx
        ├── styles.css
        ├── componentes
        │   ├── FormularioAlbum.jsx
        │   └── TablaAlbum.jsx
        ├── paginas
        │   └── AlbumPagina.jsx
        └── servicios
            └── albumServicio.js
```

El proyecto ahora esta en la raiz del repositorio. Ya no se entra a una carpeta `discosMusicales`.

## Configuracion Del Backend

Archivo: `backend/.env`

Ese archivo no se sube a Git. Para crearlo, copia el ejemplo:

```bash
cp backend/.env.example backend/.env
```

```env
PUERTOBACKEND=5000
PUERTOFRONTEND=5173
URLBASEBACKEND=http://localhost:5000
URLBASEFRONTEND=http://localhost:5173
RUTAAPI=/api
RUTAALBUMES=/albumes
DBHOST=localhost
DBPUERTO=5432
DBDIALECTO=postgresql
DBUSUARIO=postgres
DBCLAVE=tuClave
DBNOMBRE=discosmusicales
```

Valores importantes:

- `PUERTOBACKEND`: puerto donde corre Flask. Actualmente es `5000`.
- `PUERTOFRONTEND`: puerto donde corre React con Vite. Actualmente es `5173`.
- `URLBASEBACKEND`: URL base del backend. Actualmente es `http://localhost:5000`.
- `URLBASEFRONTEND`: URL base del frontend. Actualmente es `http://localhost:5173`.
- `RUTAAPI`: ruta base de la API. Actualmente es `/api`.
- `RUTAALBUMES`: ruta base del recurso albumes. Actualmente es `/albumes`.
- `DBHOST`: servidor de PostgreSQL. Actualmente es `localhost`.
- `DBPUERTO`: puerto de PostgreSQL. Actualmente es `5432`.
- `DBDIALECTO`: motor o dialecto de base de datos. Actualmente es `postgresql`.
- `DBUSUARIO`: usuario de PostgreSQL. Actualmente es `postgres`.
- `DBCLAVE`: contraseña del usuario. Cambiala por tu clave real.
- `DBNOMBRE`: nombre de la base de datos. Actualmente es `discosmusicales`.

Si tu PostgreSQL usa otro usuario, por ejemplo `postgres`, cambia:

```env
DBUSUARIO=postgres
DBCLAVE=tuClave
```

## Comandos Rapidos En Ubuntu

Instalar paquetes necesarios:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib python3 python3-pip nodejs npm
```

Levantar PostgreSQL:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Crear o cambiar la clave del usuario `postgres`:

```bash
sudo -u postgres psql
```

Dentro de PostgreSQL ejecuta:

```sql
ALTER USER postgres WITH PASSWORD 'tuClave';
\q
```

Despues actualiza `backend/.env` con esa misma clave.

## Base De Datos

La base de datos esta en:

```text
backend/baseDatos.sql
```

Para crearla en PostgreSQL:

```bash
psql -U postgres -f backend/baseDatos.sql
```

Si pide clave, escribe la clave configurada para el usuario `postgres`.

Si usas otro usuario:

```bash
psql -U tuUsuario -f backend/baseDatos.sql
```

La base creada se llama:

```text
discosmusicales
```

Tablas creadas:

- `artista`
- `album`
- `tema`

El archivo `backend/baseDatos.sql` crea la base de datos y ejecuta la migracion:

```text
backend/migraciones/001Inicial.sql
```

Para ejecutar la migracion usando los valores de `backend/.env`:

```bash
set -a
. backend/.env
set +a
PGPASSWORD="$DBCLAVE" psql -h "$DBHOST" -p "$DBPUERTO" -U "$DBUSUARIO" -f backend/baseDatos.sql
```

## Como Correr El Backend

Desde la raiz del proyecto:

```bash
cd backend
pip install -r requirements.txt
python servidor.py
```

El backend queda corriendo en:

```text
http://localhost:5000
```

La API queda corriendo en:

```text
http://localhost:5000/api
```

## Configuracion Del Frontend

Archivo: `frontend/.env`

Ese archivo no se sube a Git. Para crearlo, copia el ejemplo:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITEAPIURL=http://localhost:5000/api
```

Ese valor debe apuntar al backend usando `URLBASEBACKEND` + `RUTAAPI`.

Con la configuracion actual del backend:

```text
URLBASEBACKEND=http://localhost:5000
RUTAAPI=/api
```

Entonces en el frontend queda:

```env
VITEAPIURL=http://localhost:5000/api
```

Si cambias el puerto o la ruta del backend, tambien cambia esta URL.

Ejemplo si Flask corre en el puerto `8000`:

```env
VITEAPIURL=http://localhost:8000/api
```

Si cambias la ruta base del backend a `/backend`, entonces:

```env
VITEAPIURL=http://localhost:5000/backend
```

## Como Correr El Frontend

Desde la raiz del proyecto:

```bash
cd frontend
```

Instala dependencias solo si es la primera vez o si no existe la carpeta `node_modules`:

```bash
npm install
```

Para iniciar React si se necesita ver la pagina:

```bash
npm run dev
```

Vite mostrara una URL parecida a:

```text
http://localhost:5173
```

## Rutas Del Backend

Rutas actuales del mantenimiento de album:

```text
GET     /api/albumes
GET     /api/albumes/<idAlbum>
POST    /api/albumes
PUT     /api/albumes/<idAlbum>
DELETE  /api/albumes/<idAlbum>
```

Estas rutas salen de `backend/.env`:

```text
RUTAAPI=/api
RUTAALBUMES=/albumes
```

Ejemplo de URL completa:

```text
http://localhost:5000/api/albumes
```

## Orden Para Ejecutar Todo

1. Instalar PostgreSQL, Python, pip, Node y npm.
2. Levantar PostgreSQL.
3. Crear la clave del usuario `postgres`.
4. Copiar `backend/.env.example` a `backend/.env`.
5. Revisar usuario, contraseña, nombre de base de datos y puerto en `backend/.env`.
6. Crear la base de datos con `psql -U postgres -f backend/baseDatos.sql`.
7. Correr el backend con `python servidor.py`.
8. Copiar `frontend/.env.example` a `frontend/.env`.
9. Revisar la URL del backend en `frontend/.env`.
10. En el frontend ejecutar `npm install` solo si falta `node_modules`.
11. Correr el frontend con `npm run dev`.
