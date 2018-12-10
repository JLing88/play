const express = require('express');
const router  = express.Router();
const songsController = require('../../../controllers/songs_controller')
const playlistSongsController = require('../../../controllers/playlist_songs_controller')
const playlistsController = require('../../../controllers/playlists_controller')

router.get('/favorites', songsController.index);
router.get('/songs/:id', songsController.show);
router.post('/songs', songsController.post);
router.patch('/songs/:id', songsController.patch)
router.delete('/songs/:id', songsController.destroy)

router.delete('/playlists/:playlist_id/songs/:id', playlistSongsController.destroy)
router.get('/playlists/:id/songs', playlistSongsController.show)
router.post('/playlists/:playlist_id/songs/:id', playlistSongsController.post)

router.get('/playlists', playlistsController.index)

module.exports = router