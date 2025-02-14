import { Request, Response, NextFunction } from 'express'

import { configuration } from '../config/config'
import { logger } from '../log/logger'

const apiInfoLogger = (req: Request, res: Response, next: NextFunction) => {
  // * Log the incoming request details
  const logDetails = {
    method: req.method,
    url: req.url,
    body: req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : 'N/A',
    query: req.query && Object.keys(req.query).length > 0 ? JSON.stringify(req.query) : 'N/A',
    params: req.params && Object.keys(req.params).length > 0 ? JSON.stringify(req.params) : 'N/A',
    token: configuration.env === 'development' ? req.headers.authorization || 'N/A' : null,
    cookies: configuration.env === 'development' ? req.cookies || 'N/A' : null
  }

  logger.info(`Incoming Request: ${JSON.stringify(logDetails)}`)

  // * Capture response body
  let responseBody: unknown = null
  const originalSend = res.send
  const originalJson = res.json

  res.send = function (body: unknown): Response {
    responseBody = body
    return originalSend.call(this, body)
  }

  res.json = function (body: unknown): Response {
    responseBody = body
    return originalJson.call(this, body)
  }

  // * Log response details after the response is sent
  res.on('finish', () => {
    const responseLog = {
      statusCode: res.statusCode,
      responseBody: responseBody ? JSON.stringify(responseBody) : 'No response body',
      responseHeaders: res.getHeaders()
    }

    logger.info(`Response Sent: ${JSON.stringify(responseLog)}`)
  })

  next()
}

export default apiInfoLogger
