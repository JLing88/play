const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../src/app');

const envrionment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

});

describe('API Routes', () => {

});
