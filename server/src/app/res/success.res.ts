import { Response } from 'express'

const successResponse = (
  res: Response,
  data: object | object[],
  message: string = 'Request Successful.',
  status: number = 200
) => {
  res.status(status).send({
    status,
    success: true,
    message,
    data
  })
}

export default successResponse
