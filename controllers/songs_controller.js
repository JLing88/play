const Songs = require('../models/songs');

const index = (request, response) => {
  Songs.all()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
  });
};

const show = (request, response) => {
  Songs.getSong(request.params.id)
  .then(result => {
      response.status(200).json(result);
    })
    .catch(error => {
      response.status(404).json({ error });
    });
};

const post = (request, response) => {
  const song = request.body;
  for (let requiredParameter of ['name', 'artist_name', 'genre', 'song_rating']) {
    if (!song[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, artist_name: <String>, genre: <String>, song_rating: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  Songs.postSong(song)
    .then(song => {
      response.status(201).json({ songs: song[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
};

const patch = (request, response) => {
  const song = request.body;

  Songs.patchSong(song, request.params.id)
  .then(song => {
    response.status(200).json({ songs: song[0] })
  })
  .catch(error => {
    response.status(500).json({ error });
  });
};

const destroy = (request, response) => {
  Songs.getSong(request.params.id)
    .then(song => {
      if (song.length) {
        Songs.deleteSong(song[0]['id'])
        .then(song => {
          response.status(200).json({success: 'Song succesfully deleted'});
      })
      } else {
        response.status(404).json({
          error: `Could not find song with id ${request.params.id}`
        });
      }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
};

module.exports = {
  index,
  show,
  post,
  patch,
  destroy
};