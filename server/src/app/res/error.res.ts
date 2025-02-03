import { Response } from 'express'

const errorResponse = (
  res: Response,
  error: Error,
  message: string = 'Something Went Wrong.',
  status: number = 500
) => {
  res.status(status).send({
    status,
    success: false,
    message,
    error: error,
    stack: error.stack ?? null
  })
}

export default errorResponse
