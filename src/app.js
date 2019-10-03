require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const express = require('express');
class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use(express.json());
  }
  routes() {
    this.express.use('/api/reports', require('./routes/reportsRouter'));
    this.express.use('/api/survivors', require('./routes/survivorRouter'));
    this.express.use('/api/properties', require('./routes/propertiesRouter'))
  }
}

module.exports = new AppController().express;