const chai = require('chai');
const server = require('../src/app');

const chaitHttp = require('chai-http');
const should = chai.should();
chai.use(chaitHttp);

describe('Automated test', function () {
  let id;
  let anotherSurvivorId;
  
  describe('Survivors', function () {

    it('Register Survivors', function (done) {

      const body = {
        "name": "Codeminer",
        "age": 21,
        "sex": "Masculino",
        "last_place": "-22.8945014,-43.1185222",
        "items": [
          { "item_id": 1, "quantity": 1 },
          { "item_id": 2, "quantity": 5 },
          { "item_id": 3, "quantity": 3 },
          { "item_id": 4, "quantity": 4 }
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

    it('Return all survivor', function (done) {
      chai.request(server)
        .get('/api/survivors')
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('result');
          done();
        })
    });

    it('Update survivor locale', function (done) {

      const place = {
        "last_place": "-22.8945014,-43.1185222"
      }

      chai.request(server)
        .patch(`/api/survivors/${id}/place`)
        .send(place)
        .end(function (err, res) {
          let pointPlace = place.last_place.split(',')
          res.should.have.status(200);
          res.body.should.have.property('result');
          res.body.result.last_place.x.should.be.equal(parseFloat(pointPlace[0]));
          res.body.result.last_place.y.should.be.equal(parseFloat(pointPlace[1]));
          done();
        });
    });

    it('Reports if one survivor is infected', function (done) {
      chai.request(server)
        .patch(`/api/survivors/report_infection/${id}`)
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.equal('Successful alert');
          done();
        });
    });
  });

  describe('Reports', function () {

    it('Return statistics about zombie infection', function (done) {
      chai.request(server)
        .get(`/api/reports`)
        .end(function (err, res) {
          res.should.have.status(200)
        });
      done();
    });

  });

  describe('Properties', function () {

    it('Fetches all items of the survivor', function (done) {
      chai.request(server)
        .get(`/api/properties/${id}`)
        .end(function (err, res) {
          res.should.have.status(200)
          done();
        });
    });

    it('Search all items from all survivors', function (done) {
      chai.request(server)
        .get(`/api/properties`)
        .end(function (err, res) {
          res.should.have.status(200);
          res.body.should.have.property('result');
          done();
        });
    });

    it('Perform a new survivor record', function (done) {

      const anotherBody = {
        "name": "Codeminer42",
        "age": 21,
        "sex": "Masculino",
        "last_place": "-22.8945014,-43.1185222",
        "items": [
          { "item_id": 1, "quantity": 1 },
          { "item_id": 2, "quantity": 5 },
          { "item_id": 3, "quantity": 3 },
          { "item_id": 4, "quantity": 4 }
        ]
      }
      chai.request(server)
        .post('/api/survivors/register')
        .send(anotherBody)
        .end(function (err, res) {
          if (err) return done(err);
          res.should.have.status(200);
          res.body.should.have.property('id');
          res.body.should.have.property('name');
          res.body.should.have.property('age');
          res.body.name.should.be.equal('Codeminer42');

          anotherSurvivorId = res.body.id;
          done();
        });

    });
    it('Make a trade transaction between survivors', function (done) {

      const trade = {
        "from": {
          "item_id": 4,
          "quantity": 4
        },
        "per": {
          "survivor_id": anotherSurvivorId,
          "item_id": 1,
          "quantity": 1
        }
      }

      chai.request(server)
        .post(`/api/properties/${id}`)
        .send(trade)
        .end(function (err, res) {
          if (err) done(err)
          res.should.have.status(200);
          done();
        });
    });

  });
});