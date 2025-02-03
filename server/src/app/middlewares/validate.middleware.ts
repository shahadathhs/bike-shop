import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import errorResponse from '../res/error.res'

export const validateRequest = (schema: ZodSchema, message: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body) // * Validate request body
      next() // * Proceed to the next middleware/controller if validation passes
    } catch (error) {
      return errorResponse(res, error as Error, message, 400) // * Handle validation errors
    }
  }
}
