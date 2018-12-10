const Playlists = require('../models/playlists')

const index = (request, response) => {
  Playlists.all()
  .then(playlists => {
    response.status(200).json(playlists.rows)
  })
  .catch(error => {
    response.status(500).json({ error });
  })
};

module.exports = {
  index
}