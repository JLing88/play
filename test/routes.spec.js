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
  before((done) => {
    database.migrate.latest()
      .then( () => done())
      .catch(error => {
        throw error;
        done();
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then( () => done())
      .catch(error => {
        throw error;
        done();
      });
  });

  it('can return all favorites', done => {
    chai.request(app)
      .get('/api/v1/favorites')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });

  //
  // after((done) => {
  //
  // });


});

