import express from 'express'
import accessController from '~/controllers/access.controller'

const router = express.Router()

// signup
router.post('/shop/signup', accessController.signUp)

export const accessRouter = router
