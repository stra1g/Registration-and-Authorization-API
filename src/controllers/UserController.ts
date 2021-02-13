import { Request, Response } from 'express'
import knex from '../database/connection'
import registerValidation from '../services/validation'

class UserController {
  async create(request: Request, response: Response) {
    const { name, username, email, password } = request.body
    
    // validate data
    const { error } = registerValidation(request.body)
    if (error) return response.status(400).json({ message: error.details[0].message })

    // create user
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