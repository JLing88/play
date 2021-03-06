const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../src/app');

pry = require('pryjs')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it("has a root route", done => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('API Routes', () => {
  function buildTestDb () {
    database.migrate.latest();
    database.seed.run();
  };

  function tearDown() {
    database.migrate.rollback();
    database.schema.dropTableIfExists('playlist_songs');
    database.schema.dropTableIfExists('songs');
    database.schema.dropTableIfExists('playlists');
    database.schema.dropTableIfExists('knex_migrations');
    database.schema.dropTableIfExists('knex_migrations_lock');
  };

  before(buildTestDb)
  after(tearDown)

  it('can return all favorites', done => {
    chai.request(app)
      .get('/api/v1/favorites')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('artist_name');
        res.body[0].should.have.property('genre');
        res.body[0].should.have.property('song_rating');
        done();
      });
  });

  it('can return a single song by id', done => {

    database('songs').select(['id', 'name'])
      .then(songs => {
        song = songs[songs.length -1];
      })
        .then(() => {
          chai.request(app)
            .get(`/api/v1/songs/${song.id}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              expect(res.body.length).to.eq(1);
              res.body[0].should.have.property('id');
              res.body[0].should.have.property('name');
              expect(res.body[0]['name']).to.eq(song.name);
              res.body[0].should.have.property('artist_name');
              res.body[0].should.have.property('genre');
              res.body[0].should.have.property('song_rating');
              done();
            });
        });
  });

  it('can create a new song', done => {
    chai.request(app)
      .post('/api/v1/songs')
      .send({
        name: 'Cannot Stop Believing',
        artist_name: 'Journey',
        genre: 'Trash',
        song_rating: 50
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('songs');
        res.body['songs'].should.have.property('id');
        res.body['songs'].should.have.property('name');
        res.body['songs'].should.have.property('artist_name');
        res.body['songs'].should.have.property('genre');
        res.body['songs'].should.have.property('song_rating');
        done();
      });
  });

  it('can post a song to a playlist', done => {
    database('playlists').select(['*'])
      .then(playlists => {
        playlist = playlists[playlists.length - 1];
      })
        .then(() => {
          database('songs').select(['*'])
            .then(songs => {
              song = songs[songs.length -1];
            })
              .then(() => {
                chai.request(app)
                  .post(`/api/v1/playlists/${playlist.id}/songs/${song.id}`)
                  .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    expect(res.body['message']).to.equal(`Successfully added ${song.name} to ${playlist.name}`);
                    done();
                  });
              });
        });
  });


  it('can return all playlists and their associated songs', done => {
    chai.request(app)
      .get('/api/v1/playlists')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.have.property('id');
        res.body[0].should.have.property('name');
        res.body[0].should.have.property('songs');
        done();
      });
  });

  it('can delete a song from a playlist', done => {
    database('songs').select(['id'])
      .then(songs => {
        song = songs[songs.length -1];
      })
      .then(() => {
        database('playlists').select(['id'])
          .then(playlists => {
            playlist = playlists[playlists.length - 1];
          })
          .then(() => {
            chai.request(app)
              .delete(`/api/v1/playlists/${playlist.id}/songs/${song.id}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body['message']).to.eq(`Successfully removed ${song.name} from ${playlist.name}`)
                done();
              });
          });
      });
  });

  it('can delete a song', done => {
    var song_id
    database('songs').select(['id'])
      .then(songs => {
        song_id = songs[songs.length -1]['id'];
      })
      .then(() => {
        chai.request(app)
          .delete(`/api/v1/songs/${song_id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            done();
          });
      });
  });
});
