import bcrypt from 'bcryptjs'

const make = (value:string) => bcrypt.hash(value, 10) 

const compare = (value:string, valueHashed:string) => {
    return bcrypt.compare(value, valueHashed)
}

export default {
    make,
    compare
}