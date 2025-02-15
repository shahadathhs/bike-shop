import mongoose from 'mongoose'

import { httpStatusCode } from '../enum/statusCode'
import AppError from '../errorHandling/errors/AppError'

/**
 * Validates if a provided id is a valid MongoDB ObjectId.
 * @param id - The id to validate.
 * @throws {AppError} Throws an error if the id is not a valid ObjectId.
 */
export const validateObjectId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Invalid bike id.')
  }
}
