import express from 'express'

import { validateRequest } from '../../middlewares/validate.middleware'

import { orderController } from './order.controller'
import { orderSchema } from './order.schema'

const router = express.Router()

router.post(
  '/',
  validateRequest(orderSchema, 'Order Validation Error'),
  orderController.createOrder
)

router.get('/revenue', orderController.calculateRevenue)

export const orderRoutes = router
