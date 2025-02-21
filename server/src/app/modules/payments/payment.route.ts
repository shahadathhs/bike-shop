import express from 'express'

import { UserRole } from '../../enum/role'
import Authentication from '../../middlewares/authentication'

import { paymentController } from './payment.controller'

const router = express.Router()

router.post(
  '/create-checkout-session',
  Authentication(UserRole.CUSTOMER),

  paymentController.createCheckoutSession
)

export const paymentRoutes = router
