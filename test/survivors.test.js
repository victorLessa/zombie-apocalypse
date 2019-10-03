const chai = require('chai');
const server = require('../src/app');

const chaitHttp = require('chai-http');
const should = chai.should();

chai.use(chaitHttp);

describe('Survivors', function() {
  
  let id;
  afterEach(function (next) {
    next();
  })
  it('Register Survivors', function (done) {

    const body = {
      "name": "Codeminer",
      "age": 21,
      "sex": "Masculino",
      "last_place": null,
      "items": [
        {"item_id": 1, "quantity": 1},
        {"item_id": 2, "quantity": 5},
        {"item_id": 3, "quantity": 3},
        {"item_id": 4, "quantity": 4}
      ]
    }
    chai.request(server)
      .post('/api/survivors/register')
      .send(body)
      .end(function (err, res) {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('name');
        res.body.should.have.property('age');
        res.body.name.should.be.equal('Codeminer');

        id = res.body.id;
        done();
      });
  });

  it('Return survivor by id', function (done) {
    chai.request(server)
      .get(`/api/survivors/${id}`)
      .end(function (err, res) {
        res.should.have.status(200)
        res.body.should.have.property('result')
        done();
      })
  });
});