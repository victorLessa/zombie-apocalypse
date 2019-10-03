const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Dependencia Injection Properties
let PropertiesService = require('../service/PropertiesService');
const PropertiesController = 
  require('../controller/PropertiesController')(new PropertiesService(db));

router.post('/:id', PropertiesController.tradeItems);

module.exports = router

