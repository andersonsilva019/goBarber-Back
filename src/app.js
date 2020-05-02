require('dotenv/config');
const express = require('express');
require('express-async-errors');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const Sentry = require('@sentry/node');
const sentryConfig = require('./config/sentry');
const Youch = require('youch')

require('./database');


class App {
  /* Esse constructor é chamado no momento que instanciamos a classe */
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    /* Se não colocar esses dois métodos aqui, eles nuncam serão chamados */
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  /* Middleware de tratamento de error */
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    })
  }
}

module.exports = new App().server;
