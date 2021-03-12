import { Request, Response, NextFunction } from 'express'
import Cookies from 'universal-cookie'
import Token from '../auth/token'
import { ERR_INVALID_TOKEN } from '../utils/errorTypes'
import Cache from '../repositories/cacheRepository'
import { BLACKLIST_CACHE_PREFIX } from '../auth/confs'

async function validate(value:string){
  const unlogged = await Cache.exists(`${BLACKLIST_CACHE_PREFIX}${value}`)

  return { isValid: !unlogged }
}

export const auth = async (request: Request, response: Response, next: NextFunction) => {
  const cookies = new Cookies(request.headers.cookie)

  const authHeader = request.headers.authorization
  const authCookie = cookies.get('auth_token')
  let token = undefined;

  if (authHeader){
    token = authHeader?.split(' ')[1]
  } else if (authCookie){
    token = authCookie
  }

  if (!token) {
    return response.boom.unauthorized('you need a valid token')
  }

  const validToken = await validate(token)

  if (validToken.isValid == false){
    return response.boom.unauthorized('you need a valid token')
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