import { Request, Response } from 'express'
import usersRepository from '../repositories/usersRepository'
import tokensRepository from '../repositories/tokensRepository' 
import sendMail from '../services/email/sendMail'
import hash from '../utils/hash'
import knex from '../database/connection'

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

    const link = `${process.env.CLIENT_URL}/password-reset?token=${resetToken}?user_id=${user.id}`

    const context = {
      email: user.email,
      username: user.username
    }

    await sendMail(context, link)

    return response.json({message: 'ok'})
  }
  async updatePassword(request: Request, response: Response){
    const { password } = request.body
    const { token, user_id } = request.query

    const tokenExists = await tokensRepository.findByUser(Number(user_id))

    if (!tokenExists){
      return 
    }

    const tokenIsOk = await tokensRepository.compare(String(token), tokenExists.token)

    if (!tokenIsOk){
      return 
    }

    const currentDate = new Date()
    const expiresDate = tokenExists.expires_in

    if (currentDate > expiresDate){
      return 
    }

    const hashedPassword = await hash.make(password)

    await knex('users').where({id: user_id}).update({password: hashedPassword, updated_at: currentDate})
  }
}

export default ResetPasswordController