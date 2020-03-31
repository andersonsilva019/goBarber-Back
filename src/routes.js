const { Router } = require('express');


const routes = new Router();

/* const User = require('./app/models/User') */

const UserController = require( './app/controller/UserController' );

/* routes.get('/',  async (req, res) => {
  const user = await User.create({
    name: 'Anderson silva',
    email: 'exemplo1@exemplo.com.br',
    password_hash: '123456333',
  })

  return res.json(user);
}); */

routes.post('/users', UserController.store);

module.exports = routes;
