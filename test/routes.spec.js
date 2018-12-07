const chai = require('chai');
const should = chai.should();
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
    database.migrate.latest(configuration);
    database.seed.run(configuration);
  };

  function tearDown() {
    database.migrate.rollback();
    database.schema.dropTableIfExists('playlist_songs');
    database.schema.dropTableIfExists('songs');
    database.schema.dropTableIfExists('playlists');

  };

  before(buildTestDb)
  after(tearDown)

  // before((done) => {
  //   database.migrate.latest()
  //     .then( () => done())
  //     .catch(error => {
  //       throw error;
  //       done();
  //     });
  // });
  //
  // beforeEach((done) => {
  //   database.migrate.latest()
  //   .then(() => {
  //     database.migrate.latest()
  //   })
  //     .then(() => {
  //       return database.seed.run()
  //     })
  //       .then( () => done())
  //         .catch(error => {
  //           throw error;
  //           done();
  //     });
  // });
  //
  // afterEach((done) => {
  //   database.migrate.rollback()
  //   .then(() => {
  //     done();
  //   });
  // });

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
});
