import jwt from 'jsonwebtoken' 
import jwt_decode from 'jwt-decode'
import { ALGORITHM } from './confs'
import 'dotenv/config'
import { ERR_INVALID_TOKEN } from '../utils/errorTypes'

interface JWTData {
    iss: string,
    sub: Number,
    exp: Number,
    data: {
      user_id: Number
    }
  }

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

const decode = (data:string) => jwt_decode<JWTData>(data)

export default { generate, verifyToken, decode }