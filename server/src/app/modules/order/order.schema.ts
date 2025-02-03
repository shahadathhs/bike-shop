import { z } from 'zod'

export const orderSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),

  product: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid Product ID format')
    .min(1, 'Product ID is required'),

  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),

  totalPrice: z.number().min(0, 'Total price must be a non-negative number')
})
