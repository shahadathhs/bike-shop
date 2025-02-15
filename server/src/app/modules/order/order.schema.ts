import { z } from 'zod'

import { orderStatusEnum } from './order.helper'

export const orderSchema = z.object({
  email: z.string().email('Invalid email format'),

  product: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid Product ID format')
    .min(1, 'Product ID is required'),

  quantity: z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1'),

  totalPrice: z.number().min(0, 'Total price must be a non-negative number'),

  status: z.enum(orderStatusEnum, {
    errorMap: () => ({
      message: `Invalid order status. Allowed values are ${orderStatusEnum.join(', ')}.`
    })
  }),

  isDelivered: z.boolean().optional(),

  isDeleted: z.boolean().optional()
})

export const updateOrderSchema = orderSchema.partial()
