const { Model, Sequelize } = require('sequelize');

class Appointments extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,

      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(model) {
    this.belongsTo(model.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(model.User, { foreignKey: 'provider_id', as: 'provider' })
  }
}

module.exports = Appointments;
