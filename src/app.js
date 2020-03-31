const express = require('express');
const routes = require('./routes');

require( './database' );


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
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
