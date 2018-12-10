const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const deletePlaylistSong = (playlistId, songId) => database.raw
  (`DELETE FROM playlist_songs
    WHERE playlist_songs.playlist_id = ${playlistId} AND playlist_songs.song_id = ${songId}
  `);


const postPlaylist = (playlist, songs) => database.raw
  (`
    INSERT INTO playlist_songs (playlist_id, song_id)
    VALUES (${playlist.id}, ${song.id})
  `);

module.exports = {
  deletePlaylistSong,
  postPlaylist
}