CREATE TABLE IF NOT EXISTS artista (
  "idArtista" SERIAL PRIMARY KEY,
  "nombreArtista" VARCHAR(120) NOT NULL UNIQUE,
  pais VARCHAR(80),
  "generoMusical" VARCHAR(80),
  "fechaCreacion" TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS album (
  "idAlbum" SERIAL PRIMARY KEY,
  "tituloAlbum" VARCHAR(150) NOT NULL,
  "fechaLanzamiento" DATE,
  genero VARCHAR(80),
  "idArtista" INT NOT NULL,
  "fechaCreacion" TIMESTAMP DEFAULT now(),
  "fechaActualizacion" TIMESTAMP DEFAULT now(),
  CONSTRAINT "fkAlbumArtista"
    FOREIGN KEY ("idArtista") REFERENCES artista("idArtista")
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tema (
  "idTema" SERIAL PRIMARY KEY,
  "tituloTema" VARCHAR(150) NOT NULL,
  duracion TIME,
  "numeroPista" INT,
  "idAlbum" INT NOT NULL,
  CONSTRAINT "fkTemaAlbum"
    FOREIGN KEY ("idAlbum") REFERENCES album("idAlbum")
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reserva (
  "idReserva" SERIAL PRIMARY KEY,
  cliente VARCHAR(140) NOT NULL,
  "correoCliente" VARCHAR(160),
  "fechaReserva" DATE NOT NULL DEFAULT CURRENT_DATE,
  "fechaEvento" DATE,
  cantidad INT NOT NULL DEFAULT 1,
  estado VARCHAR(40) NOT NULL DEFAULT 'Confirmada',
  "montoTotal" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "idAlbum" INT NOT NULL,
  "fechaCreacion" TIMESTAMP DEFAULT now(),
  CONSTRAINT "chkReservaEstado"
    CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada')),
  CONSTRAINT "fkReservaAlbum"
    FOREIGN KEY ("idAlbum") REFERENCES album("idAlbum")
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Soda Stereo', 'Argentina', 'Rock')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Shakira', 'Colombia', 'Pop')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Daft Punk', 'Francia', 'Electronica')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('The Beatles', 'Reino Unido', 'Rock')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Queen', 'Reino Unido', 'Rock')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Michael Jackson', 'Estados Unidos', 'Pop')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Juan Luis Guerra', 'Republica Dominicana', 'Merengue')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Bad Bunny', 'Puerto Rico', 'Urbano')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Rosalia', 'Espana', 'Pop')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Adele', 'Reino Unido', 'Soul')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Cancion Animal', '1990-08-07', 'Rock', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Soda Stereo'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Cancion Animal');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Laundry Service', '2001-11-13', 'Pop', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Shakira'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Laundry Service');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Discovery', '2001-03-12', 'Electronica', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Daft Punk'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Discovery');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Abbey Road', '1969-09-26', 'Rock', "idArtista"
FROM artista
WHERE "nombreArtista" = 'The Beatles'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Abbey Road');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'A Night at the Opera', '1975-11-21', 'Rock', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Queen'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'A Night at the Opera');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Thriller', '1982-11-30', 'Pop', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Michael Jackson'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Thriller');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Bachata Rosa', '1990-12-11', 'Bachata', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Juan Luis Guerra'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Bachata Rosa');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Un Verano Sin Ti', '2022-05-06', 'Urbano', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Bad Bunny'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Un Verano Sin Ti');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT 'Motomami', '2022-03-18', 'Pop', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Rosalia'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = 'Motomami');

INSERT INTO album ("tituloAlbum", "fechaLanzamiento", genero, "idArtista")
SELECT '25', '2015-11-20', 'Soul', "idArtista"
FROM artista
WHERE "nombreArtista" = 'Adele'
  AND NOT EXISTS (SELECT 1 FROM album WHERE "tituloAlbum" = '25');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'De Musica Ligera', '00:03:32', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Cancion Animal'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'De Musica Ligera');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Whenever Wherever', '00:03:16', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Laundry Service'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Whenever Wherever');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'One More Time', '00:05:20', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Discovery'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'One More Time');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Come Together', '00:04:20', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Abbey Road'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Come Together');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Bohemian Rhapsody', '00:05:55', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'A Night at the Opera'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Bohemian Rhapsody');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Billie Jean', '00:04:54', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Thriller'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Billie Jean');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Burbujas de Amor', '00:04:11', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Bachata Rosa'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Burbujas de Amor');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Moscow Mule', '00:04:05', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Un Verano Sin Ti'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Moscow Mule');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Saoko', '00:02:17', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Motomami'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Saoko');

INSERT INTO tema ("tituloTema", duracion, "numeroPista", "idAlbum")
SELECT 'Hello', '00:04:55', 1, "idAlbum"
FROM album
WHERE "tituloAlbum" = '25'
  AND NOT EXISTS (SELECT 1 FROM tema WHERE "tituloTema" = 'Hello');

INSERT INTO reserva (cliente, "correoCliente", "fechaReserva", "fechaEvento", cantidad, estado, "montoTotal", "idAlbum")
SELECT 'Ana Torres', 'ana.torres@example.com', '2026-06-28', '2026-07-12', 2, 'Confirmada', 180.00, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Cancion Animal'
  AND NOT EXISTS (SELECT 1 FROM reserva WHERE cliente = 'Ana Torres' AND "fechaReserva" = '2026-06-28');

INSERT INTO reserva (cliente, "correoCliente", "fechaReserva", "fechaEvento", cantidad, estado, "montoTotal", "idAlbum")
SELECT 'Luis Ramos', 'luis.ramos@example.com', '2026-06-30', '2026-07-15', 1, 'Pendiente', 95.00, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Discovery'
  AND NOT EXISTS (SELECT 1 FROM reserva WHERE cliente = 'Luis Ramos' AND "fechaReserva" = '2026-06-30');

INSERT INTO reserva (cliente, "correoCliente", "fechaReserva", "fechaEvento", cantidad, estado, "montoTotal", "idAlbum")
SELECT 'Maria Salazar', 'maria.salazar@example.com', '2026-07-01', '2026-07-18', 4, 'Confirmada', 420.00, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Un Verano Sin Ti'
  AND NOT EXISTS (SELECT 1 FROM reserva WHERE cliente = 'Maria Salazar' AND "fechaReserva" = '2026-07-01');

INSERT INTO reserva (cliente, "correoCliente", "fechaReserva", "fechaEvento", cantidad, estado, "montoTotal", "idAlbum")
SELECT 'Carlos Medina', 'carlos.medina@example.com', '2026-07-03', '2026-07-21', 3, 'Cancelada', 255.00, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Thriller'
  AND NOT EXISTS (SELECT 1 FROM reserva WHERE cliente = 'Carlos Medina' AND "fechaReserva" = '2026-07-03');

INSERT INTO reserva (cliente, "correoCliente", "fechaReserva", "fechaEvento", cantidad, estado, "montoTotal", "idAlbum")
SELECT 'Valeria Cruz', 'valeria.cruz@example.com', '2026-07-05', '2026-07-25', 2, 'Confirmada', 210.00, "idAlbum"
FROM album
WHERE "tituloAlbum" = 'Motomami'
  AND NOT EXISTS (SELECT 1 FROM reserva WHERE cliente = 'Valeria Cruz' AND "fechaReserva" = '2026-07-05');
