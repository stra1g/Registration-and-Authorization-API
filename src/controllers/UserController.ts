import { Request, Response } from 'express'
import userRepository from '../repositories/usersRepository'
import hash from '../utils/hash'
import { ERR_DUPLICATE_EMAIL, ERR_INVALID_DATA } from '../utils/errorTypes'
import validation from '../utils/validation'

class UserController {
  async create(request: Request, response: Response) {
    try {
      const userData = request.body
      
      const { error } = validation.registerValidation(userData)
      if (error) {
        throw new Error(ERR_INVALID_DATA)
      }

      const hashedPassword = await hash.make(userData.password)
      userData.password = hashedPassword

      await userRepository.create(userData)
      return response.status(201).json({message: 'success'})
    }catch(e){
      switch(e.message){
        case ERR_DUPLICATE_EMAIL:
          response.boom.badData('Email duplicated')
          break
        case ERR_INVALID_DATA:
          response.boom.badData('invalid data')
          break
        default:
          response.boom.badImplementation(e.message)
      }
    }
    
  }
  async findByEmail(request: Request, response: Response){
    const { email } = request.query 

    const user = await userRepository.findByEmail(String(email))

    if (user){
      return response.status(200).json({userExists: true})
    }
    return response.status(200).json({userExists: false})

  }

  async findByUsername(request: Request, response: Response){
    const { username } = request.query 

    const user = await userRepository.findByUsername(String(username))
    
    if (user){
      return response.status(200).json({userExists: true})
    }
    return response.status(200).json({userExists: false})
  }
}

export default UserController