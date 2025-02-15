import { z } from 'zod'

import { bikeBrandEnum, bikeCategoryEnum, bikeModelEnum } from './bike.helper'

export const bikeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  modelName: z.enum(bikeModelEnum, {
    errorMap: () => ({
      message: `Invalid bike model. Allowed values are ${bikeModelEnum.join(', ')}.`
    })
  }),
  brand: z.enum(bikeBrandEnum, {
    errorMap: () => ({
      message: `Invalid bike brand. Allowed values are ${bikeBrandEnum.join(', ')}.`
    })
  }),
  price: z
    .number()
    .min(0, 'Price must be a non-negative number')
    .positive('Price must be greater than zero'),
  category: z.enum(bikeCategoryEnum, {
    errorMap: () => ({
      message: `Invalid bike category. Allowed values are ${bikeCategoryEnum.join(', ')}.`
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
    .min(0, 'Quantity must be a non-negative integer'),
  inStock: z.boolean().optional()
})

// * Update schema where all fields are optional, but  if a field is provided, it must pass the validation rules for that field.
export const bikeUpdateSchema = bikeSchema.partial()
