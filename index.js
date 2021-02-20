const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "neoland",
  password: "neoland",
  database: "musica"
});

con.connect();

//albumes_con_fecha();
// canciones_genero_del_artista("Santana");
// canciones_love();
playlists_por_genero("Rock");

function albumes_con_fecha() {
  const sql = 'SELECT title, DATE_FORMAT(release_date, "%d/%m/%Y") AS release_date FROM album ORDER BY title';

  con.query(sql, (err, result) => {
    if (err) throw err;

    result.forEach((item) => {
      console.log("tenemos el album: ", item.title, item.release_date);
    });

  });
}

function canciones_genero_del_artista(nombre_artista) {
  // nombre de cancion (genero)
  // nombre de cancion (genero)

  // consulta de las tablas track y genre (join) filtro where
  // const sql = `SELECT track.name as track, genre.name as genre
  //               FROM track
  //               left JOIN genre ON track.genre_id = genre.id
  //               JOIN album ON track.album_id = album.id
  //               JOIN artist ON album.artist_id = artist.id
  //               WHERE artist.name = "${nombre_artista}"
  //               ORDER BY track.name;`;
  const sql = `SELECT track.name as track, genre.name as genre
                FROM track
                left JOIN genre ON track.genre_id = genre.id
                JOIN album ON track.album_id = album.id
                JOIN artist ON album.artist_id = artist.id
                WHERE artist.name = ?
                ORDER BY track.name;`;

  con.query(sql, [nombre_artista], (err, result) => {
    if (err) throw err;

    result.forEach((item) => {
      console.log(item.track, item.genre);
    });

  });
}

function canciones_love() {
  // lista de nombre de canciones que contengan la palabra love

  const sql = `select name from track where name like '%love%'`;

  con.query(sql, (err, result) => {
    if (err) throw err;

    result.forEach((item) => {
      console.log(item.name);
    });

  });
}

function playlists_por_genero(genero) {
  // lista de playlist ordenada por nombre que contengan canciones
  // del género por parámetro y cuantas

  const sql = `select playlist.name, count(*) as songs
                from playlist
                join playlist_track on playlist.id = playlist_track.playlist_id
                join track on playlist_track.track_id = track.id
                join genre on track.genre_id = genre.id
                where genre.name = ?
                group by playlist.name
                order by playlist.name`;

  con.query(sql, [genero], (err, result) => {
    if (err) throw err;

    result.forEach((item) => {
      console.log(item.name, " tiene ", item.songs, " canciones ", genero);
    });

  });
}
