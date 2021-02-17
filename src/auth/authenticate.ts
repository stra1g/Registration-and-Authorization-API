import knex from '../database/connection'
import bcrypt from 'bcryptjs'
import { LOGIN_EXPIRATION_TIME } from '../auth/confs'
import Token from '../auth/token'
import validation from '../services/validation'

const login = async (email:string, password:string) => {

    const data = {email, password}
    const { error } = validation.loginValidation(data)
    if (error){
        // console.log('invalid data')
    }

    const user = await knex('users').where('email', email).select('*')
    if (!user[0]){
        // console.log('user not found')
    }

    const passwordIsOk = await bcrypt.compare(password, user[0].password)
    if (!passwordIsOk) {
        // console.log('user or password incorrect')
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