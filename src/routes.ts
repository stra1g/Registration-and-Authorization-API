import express from 'express'

import UserController from './controllers/UserController'
import AuthController from './controllers/AuthController'

const routes = express.Router()
const userController = new UserController()
const authcontroller = new AuthController()

routes.post('/register', userController.create)

routes.post('/login', authcontroller.login)

export default routes