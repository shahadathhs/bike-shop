import { z } from 'zod'

export const bikeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  brand: z
    .string()
    .trim()
    .min(3, 'Brand must be at least 3 characters long')
    .max(30, 'Brand cannot exceed 30 characters'),
  price: z
    .number()
    .min(0, 'Price must be a non-negative number')
    .positive('Price must be greater than zero'),
  category: z.enum(['Mountain', 'Road', 'Hybrid', 'Electric'], {
    errorMap: () => ({
      message: 'Invalid bike category. Allowed values are Mountain, Road, Hybrid, or Electric.'
    })
  }),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters long')
    .max(200, 'Description cannot exceed 200 characters'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity must be a non-negative integer')
    .max(1000, 'Quantity cannot exceed 1000'),
  inStock: z.boolean()
})

// * Update schema where all fields are optional, but  if a field is provided, it must pass the validation rules for that field.
export const bikeUpdateSchema = bikeSchema.partial()
