/* Esse arquivo vai fazer a conexão com o banco de dados e carregar os models */

const Sequelize = require('sequelize');
const mongoose = require('mongoose')

const databaseConfig = require('../config/database');

/* Import Models */
const User = require('../app/models/User');
const File = require('../app/models/File')
const Appointments = require('../app/models/Appointments');

/* Onde vai ficar todos os models */
const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  /* Esse é o método que vai fazer a conexão com o banco de dados e carregar os models */
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
    )
  }
}
module.exports = new Database();


