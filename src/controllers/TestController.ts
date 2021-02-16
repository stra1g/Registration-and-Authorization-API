import { Request, Response } from 'express'

class TestController {
    async test (request:Request, response: Response){
        return response.json({message: 'yeah, worked' })
    }
}

export default TestController