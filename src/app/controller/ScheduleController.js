const { startOfDay, endOfDay, parseISO } = require('date-fns')
const Appointment = require('../models/Appointments');
const User = require('../models/User');
const { Op } = require('sequelize')

class ScheduleController {
  async index(req, res) {

    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not provider' })
    }

    const { date } = req.query;
    const parsedDate = parseISO(date)

    /* Agendamento do dia */
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        },
      },
      /* Ordenando por data */
      order: ['date']

    })

    return res.json(appointments);
  }
}

module.exports = new ScheduleController();