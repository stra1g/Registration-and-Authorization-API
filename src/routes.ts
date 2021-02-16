import express from 'express'
import { auth } from './middlewares/auth'

import UserController from './controllers/UserController'
import AuthController from './controllers/AuthController'
import TestController from './controllers/TestController'

const routes = express.Router()
const userController = new UserController()
const authController = new AuthController()
const testController = new TestController()

routes.post('/register', userController.create)
routes.post('/login', authController.login)

routes.use(auth)

routes.get('/testJWT', testController.test)

export default routes