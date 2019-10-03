const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Dependencia Injection Reports
let ReportsService = require('../service/ReportsService');
const ReportsController = 
  require('../controller/ReportsController')(new ReportsService(db));

router.get('/', ReportsController.infectedPercentage);

module.exports = router