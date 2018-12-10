const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const Songs = require('../models/songs');
const PlaylistSongs = require('../models/playlist_songs');
const Playlists = require('../models/playlists')


const pry = require('pryjs')

app.use(cors()); // Enables CORS for our Frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/', (request, response) => {
  response.send('Place holder');
});

app.get('/api/v1/favorites', (request, response) => {
  Songs.all()
    .then((favorites) => {
      response.status(200).json(favorites);
    })
    .catch((error) => {
      response.status(500).json({ error });
  });
});

app.get('/api/v1/songs/:id', (request, response) => {
  Songs.get(request.params.id) 
  .then(result => {
      response.status(200).json(result);
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});

app.post('/api/v1/songs', (request, response) => {
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
});

app.patch('/api/v1/songs/:id', (request, response) => {
  const song = request.body;

  Songs.patchSong(songAttributes, request.params.id)
  .then(song => {
    response.status(200).json({ songs: song[0] })
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/songs/:id', (request, response) => {

  Songs.findSong(request.params.id)
    .then(song => {
      if (song.length) {
        Songs.deleteSong(song)
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
});

app.delete('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
  Songs.findSong(request.params.id)
    .then(result => {
      song = result[0];
    })
    .then(() => {
      Playlists.findPlaylist(request.params.playlist_id)
        .then(result => {
          playlist = result[0];
        })
        .then(() => {
          PlaylistSongs.deletePlaylistSong(playlist.id, song.id)
            .then(() => {
              response.status(200).json({"message": `Successfully removed ${song.name} from ${playlist.name}`})
            })
            .catch(error => {
              response.status(404).json({ error });
            });
        });
    });
});

app.get('/api/v1/playlists', (request, response) => {
  Playlists.all()
  .then(playlists => {
    response.status(200).json(playlists.rows)
  })
  .catch(error => {
    response.status(500).json({ error });
  })
});

app.get('/api/v1/playlists/:id/songs', (request, response) => {
  Playlists.getPlaylist(request.params.id)
    .then(playlist_songs => {
      response.status(200).json(playlist_songs.rows);
    })
    .catch(error => {
      response.status(404).json({ error })
    })
});

app.post('/api/v1/playlists/:playlist_id/songs/:id', (req, res) => {
  let playlist = Playlists.findPlaylist(req.params.playlist_id)
  let song = Songs.findSong(req.params.song_id)

  PlaylistSongs.postPlaylist(playlist, song)
  .then(playlist_song => {
    res.status(201).json({"message": `Successfully added ${song.name} to ${playlist.name}`});
  })
  .catch(error => {
    res.status(500).json({ error });
  });
})

module.exports = app;
