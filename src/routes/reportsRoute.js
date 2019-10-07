const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Injection Reports
let ReportsService = require('../service/ReportsService');
const ReportsController = 
  require('../controller/ReportsController')(new ReportsService(db));

router.get('/', ReportsController.percentages);

module.exports = router