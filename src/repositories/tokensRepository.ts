import knex from '../database/connection'

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

export default {
  findByUser,
  destroy
}

