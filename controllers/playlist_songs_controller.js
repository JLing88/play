const Songs = require('../models/songs');
const Playlists = require('../models/playlists');
const PlaylistSongs = require('../models/playlist_songs');
const pry = require('pryjs')
const destroy = (request, response) => {
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
};

const show = (request, response) => {
  Playlists.getPlaylist(request.params.id)
  .then(playlist_songs => {
    response.status(200).json(playlist_songs.rows);
  })
  .catch(error => {
    response.status(404).json({ error })
  })
};

const post = (request, response) => {
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
};

module.exports = {
  destroy,
  show,
  post
}