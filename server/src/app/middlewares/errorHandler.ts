import { Request, Response } from 'express'

import { configuration } from '../config/config'
import errorResponse from '../res/error.res'

const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response
) => {
  // * Log the error in development mode
  if (configuration.env === 'development') console.error(err)

  // * Send a generic error message if the error wasn't handled
  if (!res.headersSent) {
    const statusCode = err.statusCode || 500
    const message = configuration.env === 'development' ? err.message : 'Internal Server Error'
    errorResponse(res, { message } as Error, statusCode)
  }
}

export default errorHandler
