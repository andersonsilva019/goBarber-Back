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

const UserController = require('./app/controller/UserController');
const SessionController = require('./app/controller/SessionController');

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store)

module.exports = routes;
