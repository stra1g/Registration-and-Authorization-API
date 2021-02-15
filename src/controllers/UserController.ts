import { Request, Response } from 'express'
import knex from '../database/connection'
import registerValidation from '../services/validation'
import bcrypt from 'bcrypt'

class UserController {
  async create(request: Request, response: Response) {
    const { name, username, email, password } = request.body
    
    // validate data
    const { error } = registerValidation(request.body)
    if (error) return response.status(400).json({ message: error.details[0].message })

    // check if username or email already exists
    console.log(username)
    console.log(email)
    const user = await knex('users').where('username', username).orWhere('email', email).select('*')
    console.log(user)
    if (user[0]) {
      return response.status(400).json({ error: 'username or email already exists' })
    }
    

    // hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password, salt)

    //create user
    await knex('users').insert({
        name, 
        username, 
        email, 
        password: hashedpassword
    })

    return response.json({ message: 'success' })
  }
}

export default UserController