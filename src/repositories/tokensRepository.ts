import knex from '../database/connection'
import crypto from 'crypto'
import hash from '../utils/hash'

interface Token {
  id: number
  user_id: Number
  token: string
  expires_in: Date
  created_at: Date
  updated_at: Date
}

const findByUser = async (userId: number) => {
  const token: Token = await knex('tokens').where('user_id', userId).select('*').first()
  
  if (token){
    return token
  }
  return null
}

const destroy = (userId: number) => (
  knex('tokens').where('user_id', userId).del()
)

const generate = async () => {
  const resetToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = await hash.make(resetToken)

  return hashedToken
}

export default {
  findByUser,
  destroy,
  generate
}

