import jwt from 'jsonwebtoken' 
import { ALGORITHM } from './confs'
import 'dotenv/config'
import { ERR_INVALID_TOKEN } from '../utils/errorTypes'

const generate = (payload:Object) => (
    new Promise(resolve => {
        jwt.sign(payload, process.env.SECRET_KEY as jwt.Secret, { algorithm: ALGORITHM }, function(err, token) {
            if (err){
                throw new Error(ERR_INVALID_TOKEN)
            }
        
            resolve(token)
        })
    })
)

const verifyToken = (data:string) => (
    new Promise(resolve => {
        jwt.verify(data, process.env.SECRET_KEY as jwt.Secret, function (err, decoded) {
            if (err){
                throw new Error(ERR_INVALID_TOKEN)
            }

            resolve(decoded)
        })
    })
)

export default { generate, verifyToken }