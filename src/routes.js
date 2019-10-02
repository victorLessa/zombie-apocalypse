const express = require('express');
const router = express.Router();
const db = require('./config/database');
let SurvivorsService = require('./service/Survivors');
const SurvivorsController = 
  require('./controller/SurvivorsController')(new SurvivorsService(db));

if (process.env.NODE_ENV === 'test') {
  router.use(function timeLog(req, res, next) {
    console.log(`Path: ${req.headers.host + req.path}`, Date.now());
    next();
  });
}

router.get('/', SurvivorsController.index);

router.post('/register', SurvivorsController.store)
module.exports = router;