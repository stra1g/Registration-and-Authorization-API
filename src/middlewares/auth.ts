import { Request, Response, NextFunction } from 'express'
import Token from '../auth/token'
import { ERR_INVALID_TOKEN } from '../utils/errorTypes'

export const auth = async (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization

  const token = authHeader?.split(' ')[1]
  if (!token) {
    return response.boom.unauthorized('you need a token')
  }

  try {
    await Token.verifyToken(token)
    next()
  } catch (e) {
    switch (e.message) {
      case ERR_INVALID_TOKEN:
        response.boom.unauthorized('invalid token')
        break
      default:
        response.boom.badImplementation(e)
    }
  }
}