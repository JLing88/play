exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('songs', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('artist_name').notNullable();
      table.string('genre').notNullable();
      table.integer('song_rating');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('songs'),
  ]);
}
