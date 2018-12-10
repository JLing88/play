const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database.raw
  (`
    SELECT playlists.id, playlists.name,
    COALESCE(json_agg(json_build_object('id', songs.id,
                              'name', songs.name,
                              'artist_name', songs.artist_name,
                              'genre', songs.genre,
                              'rating', songs.song_rating))
                              FILTER (WHERE songs.id IS NOT NULL), '[]')
                              AS songs
    FROM playlists
    LEFT JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
    LEFT JOIN songs ON playlist_songs.song_id = songs.id
    GROUP BY playlists.id
    ORDER BY playlists.id
  `);

const getPlaylist = (playlistId) =>  database.raw
  (`
  SELECT playlists.id, playlists.name,
  json_agg(json_build_object('id', songs.id,
                              'name', songs.name,
                              'artist_name', songs.artist_name,
                              'genre', songs.genre,
                              'rating', songs.song_rating))
                              AS songs
  FROM songs
  INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
  INNER JOIN playlists ON playlist_songs.song_id = songs.id
  WHERE playlists.id = ${playlistId}
  AND playlists.id = playlist_songs.playlist_id
  GROUP BY playlists.id
  `) ;

const findPlaylist = (playlistId) => database('playlists')
  .where({id: playlistId});

module.exports = {
  all,
  findPlaylist,
  getPlaylist
}