const Appointments = require('../models/Appointments');
const User = require('../models/User');
const File = require('../models/File');
const Notification = require('../schemas/Notification');

const yup = require('yup');
const { startOfHour, parseISO, isBefore, format, subHours } = require('date-fns')
const pt = require('date-fns/locale/pt');

const Queue = require('../../lib/Queue');
const CancellationMail = require('../jobs/CancellationMail')

class AppointmentController {

  async index(req, res) {
    /* Por padrão, o usuário começa na página 1 */
    const { page = 1 } = req.query;

    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    })

    return res.json(appointments);
  }

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
      user_id: req.userId,
      provider_id,
      date: hourStart
    })

    /*
    * Notificando o usuario prestador de serviço
    */

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    )

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id
    })

    return res.json(appointments);
  }

  async delete(req, res) {

    const appointment = await Appointments.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({ error: "You don't have permission to cancel this appointment" })
    }

    /* Menos duas horas */
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: "You can only cancel appointments 2 hours in advance."
      })
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    })


    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
