import { Request, Response } from 'express'
import userRepository from '../repositories/usersRepository'
import hash from '../utils/hash'

class UserController {
  async create(request: Request, response: Response) {
    try {
      const userData = request.body
      const hashedPassword = await hash.make(userData.password)
      userData.password = hashedPassword

      await userRepository.create(userData)
      return response.status(201).json({message: 'success'})
    }catch(e){
      return response.json({message: 'error'})
    }
    
  }
}

export default UserController