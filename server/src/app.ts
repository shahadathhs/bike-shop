import cors from 'cors'
import express, { Application, Request, Response } from 'express'

import apiInfoLogger from './app/middlewares/apiInfoLogger'
import errorHandler from './app/middlewares/errorHandler'
import notFound from './app/middlewares/notFound'
import appRoutes from './app/routes/router'

// ** express app **
const app: Application = express()

// ** parse request body **
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ** cors **
app.use(cors())

// ** API Info Logger **
app.use(apiInfoLogger)

// ** Default Routes **
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Bike Shop Server!')
})
app.get('/api', (req: Request, res: Response) => {
  res.send('This is the root API route!')
})

// ** API Routes **
app.use('/api', appRoutes)

// ** API Endpoint Not Found **
app.use('*', notFound)

// ** Error Handler **
app.use(errorHandler)

export default app
