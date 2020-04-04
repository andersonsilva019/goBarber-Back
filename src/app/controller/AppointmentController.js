const Appointments = require('../models/Appointments');
const User = require('../models/User');

const yup = require('yup');
const { startOfHour, parseISO, isBefore } = require('date-fns')

class AppointmentController {
  async store(req, res) {

    const schema = yup.object().shape({
      date: yup.date().required(),
      provider_id: yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Verificando se é um usuario provedor de serviços
     * */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    })

    if (!isProvider) {
      return res.status(401).json({ error: 'you can only create appointments with provider ' })
    }

    /*
      Verificando se a data já passou
    */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' })
    }

    const checkAvailability = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      }
    })

    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date is not available' })
    }

    const appointments = await Appointments.create({
      user_id: req.user_id,
      provider_id,
      date: hourStart
    })

    return res.json(appointments);
  }
}

module.exports = new AppointmentController();