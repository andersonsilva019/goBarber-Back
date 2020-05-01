/* const User = require('./app/models/User') */

/* routes.get('/',  async (req, res) => {
  const user = await User.create({
    name: 'Anderson silva',
    email: 'exemplo1@exemplo.com.br',
    password_hash: '123456333',
  })

  return res.json(user);
}); */
const { Router } = require('express')

const routes = new Router();

const multer = require('multer');
const multerConfig = require('../src/config/multer');

/* Import Controller */
const UserController = require('./app/controller/UserController');
const SessionController = require('./app/controller/SessionController');
const FileController = require('./app/controller/FileController');
const ProviderController = require('./app/controller/ProviderController');
const AppointmentController = require('./app/controller/AppointmentController');
const ScheduleController = require('./app/controller/ScheduleController');
const NotificationController = require('./app/controller/NotificationController');
const AvailableController = require('./app/controller/AvailableController');

/* Import Middlewares */
const authMiddleware = require('./app/middlewares/auth')
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store)
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/notifications', NotificationController.index)
routes.put('/notifications/:id', NotificationController.updade)


routes.post('/files', upload.single('file'), FileController.store);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index)

routes.get('/schedule', ScheduleController.index)


module.exports = routes;
