const { Model, Sequelize } = require('sequelize');
const { isBefore, subHours } = require('date-fns')
class Appointments extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date())
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            /* Verificando se a data atual é duas horas antes */
            return isBefore(new Date(), subHours(this.date, 2))
          }
        }
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
