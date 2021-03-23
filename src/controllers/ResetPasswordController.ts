import { Request, Response } from 'express'
import usersRepository from '../repositories/usersRepository'
import tokensRepository from '../repositories/tokensRepository'

class ResetPasswordController {
  async sendResetLink(request: Request, response: Response){
    const { email } = request.body
    
    const user = await usersRepository.findByEmail(email)

    if (!user){
      return response.status(200)
    }

    const token = await tokensRepository.findByUser(user.id)

    if (token){
      tokensRepository.destroy(user.id)
    }

    const resetToken = await tokensRepository.generate()
  }
}

export default ResetPasswordController