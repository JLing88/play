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
  Songs.getSong(request.params.id)
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

  Songs.patchSong(song, request.params.id)
  .then(song => {
    response.status(200).json({ songs: song[0] })
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/songs/:id', (request, response) => {
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


  app.post('/api/v1/playlists/:playlist_id/songs/:id', (request, response) => {
    let playlistId = request.params.playlist_id;
    let songId = request.params.id;
    let songName;
    let playlistName;

    Playlists.findPlaylist(playlistId)
      .then(playlist => {
        if(playlist.length) {
          playlistName = playlist[0]['name'];
        } else {
          response.status(404).send({ error: `Playlist with ID ${playlistId} does not exist` });
        }
      })
      .then(() => {
        Songs.findSong(songId)
          .then(song => {
            if(song.length) {
              songName = song[0]['name'];
            } else {
              response.status(404).send({ error: `Song with ID ${songId} does not exist` });
            }
          })
      .then(() => {
        if(songName && playlistName) {
          PlaylistSongs.postPlaylistSong(playlistId, songId)
            .then(data => {
              response.status(201).json({
                message: `Successfully added ${songName} to ${playlistName}`
              });
            });
        }
        });
      });
  });

  // app.post('/api/v1/playlists/:playlist_id/songs/:id', (req, res) => {
  // database.raw
  //   (`
  //   SELECT playlist.id, playlist.name
  //   FROM playlists
  //   WHERE playlists.id = ${playlist_id}`)
  //   .then(result => {
  //     playlist = result;
  //   });

  // database.raw
  //   (`
  //   SELECT song.id, song.name
  //   FROM songs
  //   WHERE songs.id = ${song_id}
  //   `).then(result => {
  //     song = result;
  //   });

  // database.raw
  // (`
  //   INSERT INTO playlist_songs (playlist_id, song_id)
  //   VALUES (${playlist.id}, ${song.id})
  // `)
  // .then(playlist_song => {
  //   res.status(201).json({"message": `Successfully added ${song.name} to ${playlist.name}`});
  // })
  // .catch(error => {
  //   res.status(500).json({ error });
  // });
// })

module.exports = app;
