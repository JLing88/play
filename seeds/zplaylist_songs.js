exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('playlist_songs').del()
    .then(function () {
      // Inserts seed entries
      return knex('playlist_songs').insert([
        {playlist_id: 1, song_id: 1},
        {playlist_id: 1, song_id: 2},
        {playlist_id: 2, song_id: 3},
        {playlist_id: 2, song_id: 4},
        {playlist_id: 2, song_id: 5}
      ]);
    });
};
