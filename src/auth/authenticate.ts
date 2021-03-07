import knex from '../database/connection'
import { LOGIN_EXPIRATION_TIME, BLACKLIST_CACHE_PREFIX } from '../auth/confs'
import Token from '../auth/token'
import validation from '../utils/validation'
import hash from '../utils/hash'
import { ERR_INVALID_DATA, ERR_USER_NOT_FOUND } from '../utils/errorTypes'
import Cache from '../repositories/cacheRepository'

const login = async (email: string, password: string) => {

  const data = { email, password }
  const { error } = validation.loginValidation(data)
  if (error) {
    throw new Error(ERR_INVALID_DATA)
  }

  const user = await knex('users').where('email', email).select('*').first()
  if (!user) {
    throw new Error(ERR_USER_NOT_FOUND)
  }

  const passwordIsOk = await hash.compare(password, user.password)
  if (!passwordIsOk) {
    throw new Error(ERR_USER_NOT_FOUND)
  }

  const JWTData = {
    iss: 'reg_auth_api',
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + LOGIN_EXPIRATION_TIME,
    data: {
      user_id: user.id
    }
  }

  const token = await Token.generate(JWTData)

  return { user, token }
}

const logout = async (value: string) => {
  return Cache.set(`${BLACKLIST_CACHE_PREFIX}${value}`, '1', LOGIN_EXPIRATION_TIME)
}

export default { login, logout }