import express from 'express'
import { accessRouter } from './access'

const router = express.Router()

router.use('/v1/api', accessRouter)

export const APIs_V1 = router
