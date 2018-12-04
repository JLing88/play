const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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
