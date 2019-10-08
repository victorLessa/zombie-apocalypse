require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const express = require('express');
const router = require('../src/routes/index');
const cors = require('cors');

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.express.use(express.json());
    this.express.use(cors({
      preflightMaxAge: 5,
      origins: ['*'],
      allowHeaders: ['*', 'authorization','Authorization'],
      exposeHeaders: ['*']
    }));
    this.express.use(function (req, res, next) {
      console.log(req.method, req.path);
      next();
    });
  }
  routes() {
    this.express.use('/api/reports', router.reportsRoute);
    this.express.use('/api/survivors', router.survivorsRoute);
    this.express.use('/api/properties', router.propertiesRoute);
  }
}

module.exports = new AppController().express;