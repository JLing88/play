
Play is a an API built in express.js which allows a user to store, edit, and destroy their favorite songs. Additionally, it allow for the creation and management of playlists based on favorited songs. This project was built by myself and Dylan Meskis over the course of 2 weeks. The most challenging part of this project was learning and implementing Javascript in a short amount of time. 

## Getting the application set up on your machine

* Clone the Github respository - `git@github.com:JLing88/play.git`

* `$ npm install` will retrieve all of the Node depdencies

* `$ knex migrate:latest` will create and setup structure of the database

* `$ knex seed:run` will populate the development database with some mock values for demonstrative and testing purposes

* `$ mocha --exit` will run the test suite

## The available endpoints include:

### Favorite Songs

* `GET /api/v1/favorites` returns all favorited (saved) songs
* `POST /api/v1/songs` saves a songs to the database
  * required body parameters: `{name, artist_name, genre, song_rating}`
  
router.get('/songs/:id', songsController.show);
router.post('/songs', songsController.post);
router.patch('/songs/:id', songsController.patch)
router.delete('/songs/:id', songsController.destroy)

router.delete('/playlists/:playlist_id/songs/:id', playlistSongsController.destroy)
router.get('/playlists/:id/songs', playlistSongsController.show)
router.post('/playlists/:playlist_id/songs/:id', playlistSongsController.post)

router.get('/playlists', playlistsController.index)

* `GET /api/v1/items/most_revenue?quantity=x` returns the top x items ranked by total revenue generated
* `GET /api/v1/items/most_items?quantity=x` returns the top x item instances ranked by total number sold
* `GET /api/v1/items/:id/best_day` returns the date with the most sales for the given item using the invoice date. If there are multiple days with equal number of sales, return the most recent day.

#### Customers

* `GET /api/v1/customers/:id/favorite_merchant` returns a merchant where the customer has conducted the most successful transactions
