import { Request, Response, NextFunction } from 'express'
import Token from '../auth/token'

export const auth = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        return response.status(401).json({message: 'you need a token'})
    }

    const token = authHeader?.split(' ')[1]

    try {
        await Token.verifyToken(token)
        next()
    } catch (e) {
        return response.status(401).json({message: 'you need a token'})
    }
}