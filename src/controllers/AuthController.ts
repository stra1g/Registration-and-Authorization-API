import { Request, Response } from 'express'
import 'dotenv/config'
import authenticate from '../auth/authenticate'

class AuthController {
    async login (request: Request, response: Response) {
        const {email, password} = request.body

        try {
            const token = await authenticate.login(email, password)

            return response.status(200).json({token})
        } catch (e){
            return response.json({message: 'error'})
        }
    }
}

export default AuthController