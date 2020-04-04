/* Esse arquivo vai fazer a conexão com o banco de dados e carregar os models */

const Sequelize = require('sequelize');

const databaseConfig = require('../config/database');

/* Import Models */
const User = require('../app/models/User');
const File = require('../app/models/File')

/* Onde vai ficar todos os models */
const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  /* Esse é o método que vai fazer a conexão com o banco de dados e carregar os models */
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }
}
module.exports = new Database();


