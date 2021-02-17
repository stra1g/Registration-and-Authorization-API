import knex from '../database/connection'
import { LOGIN_EXPIRATION_TIME } from '../auth/confs'
import Token from '../auth/token'
import validation from '../utils/validation'
import hash from '../utils/hash'
import { ERR_INVALID_DATA, ERR_USER_NOT_FOUND } from '../utils/errorTypes'

const login = async (email:string, password:string) => {

    const data = {email, password}
    const { error } = validation.loginValidation(data)
    if (error){
        throw new Error(ERR_INVALID_DATA)
    }

    const user = await knex('users').where('email', email).select('*')
    if (!user[0]){
        throw new Error(ERR_USER_NOT_FOUND)
    }

    const passwordIsOk = await hash.compare(password, user[0].password)
    if (!passwordIsOk) {
        throw new Error(ERR_USER_NOT_FOUND)
    }

    const JWTData = {
        iss: 'reg_auth_api',
        sub: user[0].id,
        exp: Math.floor(Date.now() / 1000) + LOGIN_EXPIRATION_TIME
    }

    const token = await Token.generate(JWTData)

    return token
}   

export default { login }