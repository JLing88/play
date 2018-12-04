const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())

app.listen(process.env.PORT || 8081)

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/songs');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});


var Song = require("../models/song");

app.get('/songs', (req, res) => {
  Song.find({}, 'name artist_name genre song_rating', function (error, songs) {
    if (error) { console.error(error); }
    res.send({
      songs: songs
    })
  }).sort({_id:-1})
})

app.post('/songs', (req, res) => {
  console.log(req.body)
  var db = req.db;
  var name = req.body.name;
  var artist_name = req.body.artist_name;
  var genre = req.body.genre;
  var song_rating = req.body.song_rating;
  console.log(song_rating)
  var new_song = new Song({
    name: name,
    artist_name: artist_name,
    genre: genre,
    song_rating: song_rating
  })

  new_song.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Song saved successfully!'
    })
  })
})
