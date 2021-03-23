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

    const expiresDate = new Date()
    expiresDate.setUTCHours(expiresDate.getUTCHours() + 1)

    const tokenData = {
      user_id: user.id,
      token: resetToken,
      expires_in: expiresDate
    }

    await tokensRepository.create(tokenData)
  }
}

export default ResetPasswordController