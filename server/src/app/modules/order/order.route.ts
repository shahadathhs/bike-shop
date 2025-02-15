import express from 'express'

import { UserRole } from '../../enum/role'
import Authentication from '../../middlewares/authentication'
import validateRequest from '../../middlewares/validateRequest'

import { orderController } from './order.controller'
import { orderSchema, updateOrderSchema } from './order.schema'

const router = express.Router()

// Create a new order - only accessible to customers
router.post(
  '/',
  Authentication(UserRole.CUSTOMER),
  validateRequest(orderSchema),
  orderController.createOrder
)

// Get a specific order by ID - accessible to both admin and customer
router.get('/:id', Authentication(UserRole.ADMIN, UserRole.CUSTOMER), orderController.getOrderById)

// Get current user's orders - accessible to both admin and customer (admin can view all users' orders)
// * if requested is by admin then email will not be validated (like match with token's email)
// * if requested is by customer then email will be validated, email need to match with token's email
router.get(
  '/myOrders/:email',
  Authentication(UserRole.ADMIN, UserRole.CUSTOMER),
  orderController.getMyOrders
)

// Update an order - admin only
router.put(
  '/:id',
  Authentication(UserRole.ADMIN),
  validateRequest(updateOrderSchema),
  orderController.updateOrder
)

// Update order status - admin only
router.patch(
  '/:id/status',
  Authentication(UserRole.ADMIN),
  validateRequest(updateOrderSchema),
  orderController.updateOrderStatus
)

// Delete an order - admin only
router.delete('/:id', Authentication(UserRole.ADMIN), orderController.deleteOrder)

// Cancel an order - customer only
router.patch('/:id/cancel', Authentication(UserRole.CUSTOMER), orderController.cancelOrder)

// Get all orders - admin only
router.get('/admin/getAll', Authentication(UserRole.ADMIN), orderController.getAllOrders)

// Calculate revenue - admin only
router.get('/admin/revenue', Authentication(UserRole.ADMIN), orderController.calculateRevenue)

// Get order analytics - admin only
router.get('/admin/analytics', Authentication(UserRole.ADMIN), orderController.getAnalytics)

export const orderRoutes = router
