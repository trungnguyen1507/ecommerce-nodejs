import express from 'express'
import { asyncHandler } from '~/helpers/asyncHandler'
import accessController from '~/controllers/access.controller'
import { authentication } from '~/auth/authUtils'

const router = express.Router()

// signup
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authentication)
/////////////////
router.post('/shop/logout', asyncHandler(accessController.logout))
export const accessRouter = router
