import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import './dbs/init.mongodb.js'
import dotenv from 'dotenv'
import { APIs_V1 } from './routes'

dotenv.config()
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// init db

// init routes
app.use('', APIs_V1)

// handling error

export default app
