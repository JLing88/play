const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('songs')
  .select(['id', "name", "artist_name", "genre", "song_rating"]);

const getSong = (songId) => database('songs')
  .select(['id', "name", "artist_name", "genre", "song_rating"])
  .where({ id: songId});

const postSong = (songAttributes) =>  database('songs')
  .insert(songAttributes, ['id', 'name', 'artist_name', 'genre', 'song_rating']);


module.exports = {
  all, getSong, postSong
}