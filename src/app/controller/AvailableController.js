const {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter     //Verificar se a data já passou
} = require('date-fns');
const Appointment = require('../models/Appointments')
const { Op } = require('sequelize');

class AvailableController {
  async index(req, res) {

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);

    /* Pegando todos os compromissos do dia  */
    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    });

    const schedule = [
      '08:00',  //2020-06-23 08:00:00
      '09:00',  //2020-06-23 09:00:00
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const avaiable = schedule.map(time => {
      /* Separando 08(hour):00(minute) */
      const [hour, minute] = time.split(':');
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0)

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaiable:
          isAfter(value, new Date()) &&  /* Verificando se data já passou */
          /* Verificando se já tem um compromisso marcado para esse horário */
          !appointment.find(a =>
            format(a.date, 'HH:mm') === time
          )
      }
    })

    return res.json(avaiable);
  }
}

module.exports = new AvailableController();
