exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('songs').del()
    .then(function () {
      // Inserts seed entries
      return knex('songs').insert([
        {name: 'Crazy In Love', artist_name: 'Beyonce', genre: 'Contemporary R&B', song_rating: 88},
        {name: 'Hot in Here', artist_name: 'Nelly', genre: 'Hip Hop', song_rating: 7},
        {name: 'Blurred Lines', artist_name: 'Robin Thicke', genre: 'Disco', song_rating: 93},
        {name: 'Umbrella', artist_name: 'Rihanna', genre: 'Pop', song_rating: 46},
        {name: 'Umbrella', artist_name: 'Rihanna', genre: 'Pop', song_rating: 75},
      ]);
    });
};
