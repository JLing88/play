
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('playlist_songs', function(table) {
      table.increments('id').primary();
      table.integer('playlist_id').unsigned();
      table.integer('song_id').unsigned();
      table.foreign('playlist_id').references('playlists.id').onDelete('CASCADE');
      table.foreign('song_id').references('songs.id').onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('playlist_songs')
  ])
};
