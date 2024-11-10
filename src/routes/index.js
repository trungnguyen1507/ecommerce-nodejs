import express from 'express'
import { accessRouter } from './access'
import { apiKey, permissions } from '~/auth/checkAuth'

const router = express.Router()

// check apiKey
router.use(apiKey)
// check permissions
router.use(permissions('0000'))

router.use('/v1/api', accessRouter)

export const APIs_V1 = router
