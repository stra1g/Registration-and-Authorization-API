import { Request, Response } from 'express'
import 'dotenv/config'
import authenticate from '../auth/authenticate'
import { ERR_USER_NOT_FOUND, ERR_INVALID_DATA, ERR_INVALID_TOKEN } from '../utils/errorTypes'

class AuthController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body

    try {
      const token = await authenticate.login(email, password)

      return response.status(200).json({ token })
    } catch (e) {
      switch (e.message) {
        case ERR_INVALID_DATA:
          response.boom.badData('invalid data')
          break
        case ERR_USER_NOT_FOUND:
          response.boom.notFound('email or password invalid')
          break
        case ERR_INVALID_TOKEN:
          response.boom.unauthorized('invalid token')
          break
        default:
          response.boom.badImplementation(e)
      }
    }
  }
}

export default AuthController