
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('playlist_songs', function(table) {
      table.increments('id').primary();
      table.integer('playlist_id').references('playlists.id')
      table.integer('song_id').references('songs.id')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlist_songs')
  ])
};
