import { Request, Response } from 'express'
import userRepository from '../repositories/usersRepository'
import bcrypt from 'bcryptjs'

class UserController {
  async create(request: Request, response: Response) {
    try {
      const userData = request.body
  
      // hashing password
      const salt = await bcrypt.genSalt(10)
      const hashedpassword = await bcrypt.hash(userData.password, salt)
      userData.password = hashedpassword

      await userRepository.create(userData)
      return response.status(201).json({message: 'success'})
    } catch(e){
      return response.json({message: 'error'})
    }
    
  }
}

export default UserController