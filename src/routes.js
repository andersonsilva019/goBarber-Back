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

/* Controller */
const UserController = require('./app/controller/UserController');
const SessionController = require('./app/controller/SessionController');

/* Middlewares */
const authMiddleware = require('./app/middlewares/auth')
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store)
routes.post('/users', UserController.store);

routes.put('/users', authMiddleware, UserController.update);

/* Upload de arquivo por vez */
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true })
})

module.exports = routes;
