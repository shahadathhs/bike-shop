import express from 'express'
import { orderController } from './order.controller'
import { validateRequest } from '../../middlewares/validate.middleware'
import { orderSchema } from './order.schema'

const router = express.Router()

router.post(
  '/',
  validateRequest(orderSchema, 'Order Validation Error'),
  orderController.createOrder
)

router.get('/revenue', orderController.calculateRevenue)

export const orderRoutes = router
