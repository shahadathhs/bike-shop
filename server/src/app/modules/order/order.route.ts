import express from 'express'

import validateRequest from '../../middlewares/validateRequest'

import { orderController } from './order.controller'
import { orderSchema } from './order.schema'

const router = express.Router()

router.post('/', validateRequest(orderSchema), orderController.createOrder)

router.get('/revenue', orderController.calculateRevenue)

export const orderRoutes = router
