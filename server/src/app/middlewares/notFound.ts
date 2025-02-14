import { Request, Response } from 'express'

import { httpStatusCode } from '../enum/statusCode'

const notFound = (req: Request, res: Response) => {
  res.status(httpStatusCode.NOT_FOUND).send({
    status: httpStatusCode.NOT_FOUND,
    success: false,
    message: 'API Not Found or Invalid URL!!'
  })
}

export default notFound
