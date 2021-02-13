import { Request, Response } from 'express'
import knex from '../database/connection'

class UserController {
    async create (request: Request, response: Response) {
        const { name, username, email, password } = request.body
        
        await knex('users').insert({
            name, 
            username, 
            email, 
            password
        })
    
        return response.json({ message: 'success' })
    }
}

export default UserController