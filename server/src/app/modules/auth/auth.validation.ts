import { z } from 'zod'

const registerUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, { message: 'Name must be at least 5 characters' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      // .min(6, { message: 'Password must be at least 6 characters' })
      // .max(20, { message: 'Password must be at most 20 characters' })
  })
})

const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password must be at most 20 characters' })
  })
})

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(5, { message: 'Name must be at least 5 characters' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' })
  })
})

export const AuthValidation = {
  registerUserZodSchema,
  loginUserZodSchema,
  updateProfileZodSchema
}
