exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('songs').del()
    .then(function () {
      // Inserts seed entries
      return knex('songs').insert([
        {name: 'Song 1', artist_name: 'Artist 1', genre: 'Genre 1', song_rating: 50},
        {name: 'Song 2', artist_name: 'Artist 2', genre: 'Genre 2', song_rating: 50},
      ]);
    });
};