import knex from '../database/connection'
import {ERR_DUPLICATE_EMAIL}  from '../utils/errorTypes'

interface UserData {
    name: string,
    username: string,
    email: string, 
    password: string
}   

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

export default { create }