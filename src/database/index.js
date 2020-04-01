/* Esse arquivo vai fazer a conexão com o banco de dados e carregar os models */

const Sequelize = require('sequelize');

const databaseConfig = require('../config/database');

const User = require('../app/models/User');

/* Onde vai ficar todos os models */
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  /* Esse é o método que vai fazer a conexão com o banco de dados e carregar os models */
  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}
module.exports = new Database();


