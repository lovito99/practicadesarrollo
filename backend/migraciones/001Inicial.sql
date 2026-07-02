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

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Soda Stereo', 'Argentina', 'Rock')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Shakira', 'Colombia', 'Pop')
ON CONFLICT ("nombreArtista") DO NOTHING;

INSERT INTO artista ("nombreArtista", pais, "generoMusical")
VALUES ('Daft Punk', 'Francia', 'Electronica')
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
