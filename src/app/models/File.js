const { Model, Sequelize } = require('sequelize');

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`
          }
        }   /* Esse campo só existe aqui, não tem no banco de dados */
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

module.exports = File;
