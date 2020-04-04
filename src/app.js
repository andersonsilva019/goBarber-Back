const express = require('express');
const routes = require('./routes');
const path = require('path')

const _ = require('./database');


class App {
  /* Esse constructor é chamado no momento que instanciamos a classe */
  constructor() {
    this.server = express();

    /* Se não colocar esses dois métodos aqui, eles nuncam serão chamados */
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
