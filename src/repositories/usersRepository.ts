import knex from '../database/connection'
import {ERR_DUPLICATE_EMAIL}  from '../utils/errorTypes'
import Cache from '../repositories/cacheRepository'
import { LOGIN_EXPIRATION_TIME } from '../auth/confs'

interface UserData {
    id: Number,
    name: string,
    username: string,
    email: string, 
    password: string,
    created_at: Date,
    updated_at: Date
}   

const PREFIX_CACHE = 'userId:'

const create = async (userData:UserData) => {
    const userExists = await knex('users').where('email', userData.email).select('*')
    if (userExists[0]){
        throw new Error(ERR_DUPLICATE_EMAIL)
    }

    return await knex('users').insert({
        name: userData.name,
        username: userData.username, 
        email: userData.email,
        password: userData.password
    })

}

const findByEmail = async (email: string) => {
  const user = await knex('users').where('email', email).select('*').first()

  if (user){
    return user
  }
  return null
}

const findByUsername = async (username: string) => {
  const user = await knex('users').where('username', username).select('*').first()

  if (user){
    return user
  }
  return null
}

const setCache = (user:UserData) => (
    Cache.set(`${PREFIX_CACHE}${user.id}`, JSON.stringify(user), LOGIN_EXPIRATION_TIME)
)

const removeCache = (userId:Number) => (
    Cache.del(`${PREFIX_CACHE}${userId}`)
)

export default { 
    create,
    findByEmail,
    findByUsername,
    setCache,
    removeCache
}
