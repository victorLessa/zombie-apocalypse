const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Dependencia Injection Survivors
let SurvivorsService = require('../service/SurvivorsService');
const SurvivorsController = 
  require('../controller/SurvivorsController')(new SurvivorsService(db));

router.get('/', SurvivorsController.index);
router.post('/register', SurvivorsController.store);
router.patch('/report_infection', SurvivorsController.updateInfectionIndicator);

module.exports = router