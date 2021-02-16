import { Request, Response } from 'express'
import knex from '../database/connection'
import validation from '../services/validation'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import Token from '../auth/token'
import { LOGIN_EXPIRATION_TIME } from '../auth/confs'

class AuthController {
    async login (request: Request, response: Response) {
        const {email, password} = request.body

        const { error } = validation.loginValidation(request.body)
        if (error) return response.status(422).json({message: error.details[0].message})
        
        const user = await knex('users').where('email', email).select('*')
        
        if (!user[0]) {
            return response.status(400).json({message: 'user not found'})
        }

        const passwordIsOk = await bcrypt.compare(password, user[0].password)

        if (!passwordIsOk) {
            return response.status(400).json({message: 'e-mail or password invalid'})
        }

        const JWTData = {
            iss: 'reg_auth_api',
            sub: user[0].id,
            exp: Math.floor(Date.now() / 1000) + LOGIN_EXPIRATION_TIME
        }

        const token = await Token.generate(JWTData)

        return response.json({token})
    }
}

export default AuthController