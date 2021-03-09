import express from 'express'
import routes from './routes'
import boom from 'express-boom'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import 'dotenv/config'

const app = express()

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(boom())
app.use(express.json())
app.use(cookieParser())
app.use(routes)

app.listen(process.env.PORT, () => console.log('server up'))

