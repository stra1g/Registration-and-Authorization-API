import express from 'express'
import routes from './routes'
import boom from 'express-boom'
import cors from 'cors'

import 'dotenv/config'

const app = express()

app.use(cors())
app.use(boom())
app.use(express.json())
app.use(routes)

app.listen(process.env.PORT, () => console.log('server up'))

