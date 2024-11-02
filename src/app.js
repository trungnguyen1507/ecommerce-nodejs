import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'

const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
// init db

// init routes

// handling error

export default app
