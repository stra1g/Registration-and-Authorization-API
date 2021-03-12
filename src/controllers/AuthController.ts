import { Request, Response } from 'express'
import Cookies from 'universal-cookie'
import 'dotenv/config'
import authenticate from '../auth/authenticate'
import userRepository from '../repositories/usersRepository'
import { ERR_USER_NOT_FOUND, ERR_INVALID_DATA, ERR_INVALID_TOKEN } from '../utils/errorTypes'
import Token from '../auth/token'

interface JWTData {
  iss: string,
  sub: Number,
  exp: Number,
  data: {
    user_id: Number
  }
}

class AuthController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body
    const cookies = new Cookies(request.headers.cookie)

    try {
      const {user, token} = await authenticate.login(email, password)

      await userRepository.setCache(user)

      const userId = user.id

      //cookies.set('myCat', 'Pacman', { path: '/' });
      response.cookie('auth_token', String(token), { path: '/', httpOnly: true})

      return response.status(200)
        .json({ token, userId })
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

  async logout (request: Request, response: Response) {
    const authHeader = request.headers.authorization

    const cookies = new Cookies(request.headers.cookie)
    const authCookie = cookies.get('auth_token')

    let token = '';

    if (authHeader){
      token = authHeader?.split(' ')[1]
    } else if (authCookie){
      token = authCookie
    }
    
    try {
      const decodedJWT = Token.decode(token)
      const userId = decodedJWT.data.user_id

      await Promise.all([
        authenticate.logout(token),
        userRepository.removeCache(userId),
        response.clearCookie('auth_token')
      ])

      return response.status(200).json({message: 'unlogged'})
    } catch(e){
      response.boom.badImplementation(e)
    }
  }

}


export default AuthController