var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var SongSchema = new Schema({name: String,
//                              artist_name: String,
//                              genre: String,
//                              song_rating: Number
// });

var SongSchema = new Schema({name: {type: String,
                                    required: true},
                             artist_name: {type: String,
                                           required: true},
                             genre: {type: String,
                                     required: true},
                             song_rating: {type: Number,
                                           min: 0,
                                           max: 100,
                                           required: true}
});

var Song = mongoose.model("Song", SongSchema);
module.exports = Song;
