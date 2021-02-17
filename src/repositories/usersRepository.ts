import validation from '../services/validation'
import knex from '../database/connection'

interface UserData {
    name: string,
    username: string,
    email: string, 
    password: string
}   

const create = async (userData:UserData) => {
    const { error } = validation.registerValidation(userData)
    if (error) {
        //console.log('invalid data')
    }

    const userExists = await knex('users').where('email', userData.email).select('*')
    if (userExists[0]){
        // console.log('user already exists')
    }

    return await knex('users').insert({
        name: userData.name,
        username: userData.username, 
        email: userData.email,
        password: userData.password
    })

}

export default { create }