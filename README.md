
Play is a an API built on express.js which allows a user to store, edit, and destroy their favorite songs. Additionally, it allow for the creation and management of playlists based on favorited songs. This project was built by myself and [Dylan Meskis](https://github.com/dmeskis) over the course of 2 weeks. The most challenging part of this project was learning and implementing Javascript in a short amount of time. 

The front end application which consumes this data can be see [here](https://playfe.herokuapp.com/)

## Getting the application set up on your machine

* Clone the Github repository - `git@github.com:JLing88/play.git`

* `$ npm install` will retrieve all of the Node depdencies

* `$ knex migrate:latest` will create and setup structure of the database

* `$ knex seed:run` will populate the development database with some mock values for demonstrative and testing purposes

* `$ mocha --exit` will run the test suite

## Getting started using the API

### Base URL

* `https://playbe.herokuapp.com/`

## Endpoints

### Favorite Songs

* `GET /api/v1/favorites` returns all favorited songs
* `GET /api/v1/songs/:id` returns a specific favorited song
* `POST /api/v1/songs` creates and saves a song to the database
  * required body parameters: `{name}`
  * optional body parameters: `{artist_name, genre, song_rating}`
* `PATCH /api/v1/songs/:id` updates a specific song
  * optional body parametes: `{name, artist_name, genre, song_rating}`
* `DESTROY /api/v1/songs/:id` deletes a specific song

### Playlists

* `GET /api/v1/playlists` returns all playlists and their associated songs
* `GET /api/v1/playlists/:id/songs` returns a single playlist and its associated songs
  ```[
       {
           "id": 2,
           "name": "Playlist 2",
           "songs": [
             {
               "id": 3,
               "name": "Blurred Lines",
               "artist_name": "Robin Thicke",
               "genre": "Disco",
               "rating": 93
             },
             {
               "id": 4,
               "name": "Umbrella",
               "artist_name": "Rihanna",
               "genre": "Pop",
               "rating": 46
             }
           ]
        }
      ]```

* `POST /api/v1/playlists/:id/songs/:id` creates and saves a song associated with a specific playlist
* `DELETE /api/v1/playlists/:id/songs/:id` deletes a specific song from a specific playlist

## Technologies Used

* [express.js](https://expressjs.com/)
* [node.js](https://nodejs.org/en/)
* [knex.js](https://knexjs.org/)
* [postgreSQL](https://www.postgresql.org/)

