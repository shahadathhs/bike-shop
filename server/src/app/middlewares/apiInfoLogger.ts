import { Request, Response, NextFunction } from 'express'

import { logger } from '../log/logger'

const apiInfoLogger = (req: Request, res: Response, next: NextFunction) => {
  const logDetails = `
    Method: ${req.method}
    URL: ${req.url}
    Body: ${req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : 'No body content'}
    Query: ${req.query && Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : 'No query content'}
    Params: ${req.params && Object.keys(req.params).length > 0 ? JSON.stringify(req.params) : 'No params content'}
    Headers: ${JSON.stringify(req.headers)}
  `

  logger.info(`Incoming Request: ${logDetails.trim()}`)
  next()
}

export default apiInfoLogger
