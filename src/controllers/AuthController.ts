import { Request, Response } from 'express'
import knex from '../database/connection'
import bcrypt from 'bcryptjs'

class AuthController {
    async login (request: Request, response: Response) {
        const {email, password} = request.body
        
        const user = await knex('users').where('email', email).select('*')
        
        if (!user[0]) {
            return response.status(400).json({message: 'user not found'})
        }

        const passwordIsOk = await bcrypt.compare(password, user[0].password)

        if (!passwordIsOk) {
            return response.status(400).json({message: 'e-mail or password invalid'})
        }

        return response.status(200).json({message: 'success'})
    }
}

export default AuthController