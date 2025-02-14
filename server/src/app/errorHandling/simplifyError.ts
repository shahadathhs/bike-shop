import { ZodError } from 'zod'

import { httpStatusCode } from '../enum/statusCode'
import { IErrorResponse, IErrorSource } from '../interface/error'

import AppError from './errors/AppError'
import handleCastError from './errors/handleCastError'
import handleDuplicateError from './errors/handleDuplicateError'
import handleValidationError from './errors/handleValidationError'
import handleZodError from './errors/handleZodError'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const simplifyError = (err: any): IErrorResponse => {
  // * Default values
  let statusCode = httpStatusCode.INTERNAL_SERVER_ERROR
  let message = 'Something went wrong!'
  let errorSources: IErrorSource[] = [
    {
      path: '',
      message: 'Something went wrong'
    }
  ]

  const assignErrorDetails = (errorResponse: IErrorResponse) => {
    statusCode = errorResponse.statusCode
    message = errorResponse.message
    errorSources = errorResponse.errorSources
  }

  // Handling different error types
  if (err instanceof ZodError) {
    assignErrorDetails(handleZodError(err))
  } else if (err?.name === 'ValidationError') {
    assignErrorDetails(handleValidationError(err))
  } else if (err?.name === 'CastError') {
    assignErrorDetails(handleCastError(err))
  } else if (err?.code === 11000) {
    assignErrorDetails(handleDuplicateError(err))
  } else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    errorSources = [
      {
        path: '',
        message: err.message
      }
    ]
  } else if (err instanceof Error) {
    message = err.message
    errorSources = [
      {
        path: '',
        message: err.message
      }
    ]
  }

  return { statusCode, message, errorSources }
}

export default simplifyError
