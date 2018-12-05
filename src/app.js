const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

pry = require('pryjs')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play';

app.get('/', (request, response) => {
  response.send('Place holder');
});

app.get('/api/v1/favorites', (request, response) => {
  database('songs').select(["name", "artist_name", "genre", "song_rating"])
    .then((favorite) => {
      response.status(200).json({ name: favorite[0], artist_name: favorite[1], genre: favorite[2], song_rating: favorite[3] });
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
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

  database('songs').insert(song, ['id', 'name', 'artist_name', 'genre', 'song_rating'])
  .then(song => {
    response.status(201).json({ songs: song[0] })
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.patch('/api/v1/songs/:id', (request, response) => {
  const song = request.body;

  database('songs')
  .where({ id: request.params.id})
  .update(song, ['id', 'name', 'artist_name', 'genre', 'song_rating'])
  .then(song => {
    response.status(200).json({ songs: song[0] })
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/songs/:id', (request, response) => {

  database('songs')
    .where({id: request.params.id})
    .then(song => {
      if (song.length) {
        database('songs')
          .where({ id: song[0].id })
            .del().then(song => {
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
