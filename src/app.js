const express = require('express');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];

const PlaylistSongs = require('../models/playlist_songs');
const Playlists = require('../models/playlists')

const pry = require('pryjs')

const routes = require('../routes/api/v1/routes')


app.use(cors()); // Enables CORS for our Frontend
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.use('/api/v1', routes)

app.get('/', (request, response) => {
  response.send('Place holder');
});

module.exports = app;
