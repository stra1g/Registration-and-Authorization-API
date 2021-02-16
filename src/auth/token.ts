import jwt from 'jsonwebtoken' 
import { ALGORITHM } from './confs'
import 'dotenv/config'

const generate = (payload:Object) => (
    new Promise(resolve => {
        jwt.sign(payload, process.env.SECRET_KEY as jwt.Secret, { algorithm: ALGORITHM }, function(err, token) {
            if (err){
                return {error: err}
            }
        
            resolve(token)
        })
    })
)

const verifyToken = (data:string) => (
    new Promise(resolve => {
        jwt.verify(data, process.env.SECRET_KEY as jwt.Secret, function (err, decoded) {
            if (err){
                return {error: err}
            }

            resolve(decoded)
        })
    })
)

export default { generate, verifyToken }