const Appointments = require('../models/Appointments');
const User = require('../models/User');
const yup = require('yup');

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

    /* Verificando se é um usuario provedor de serviços */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    })

    if (!isProvider) {
      return res.status(401).json({ error: 'you can only create appointments with provider ' })
    }

    const appointments = await Appointments.create({
      user_id: req.user_id,
      provider_id,
      date
    })

    return res.json(appointments);
  }
}

module.exports = new AppointmentController();