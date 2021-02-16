import express from 'express'
import routes from './routes'

import 'dotenv/config'

const app = express()

app.use(express.json())
app.use(routes)

app.listen(process.env.PORT)

