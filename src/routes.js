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

/* Controller */
const UserController = require('./app/controller/UserController');
const SessionController = require('./app/controller/SessionController');

/* Middlewares */
const authMiddleware = require('./app/middlewares/auth')

routes.post('/sessions', SessionController.store)
routes.post('/users', UserController.store);

routes.put('/users', authMiddleware, UserController.update);

module.exports = routes;
