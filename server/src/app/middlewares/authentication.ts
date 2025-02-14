import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

import { httpStatusCode } from '../enum/statusCode'
import AppError from '../errorHandling/errors/AppError'
import sendError from '../errorHandling/sendError'
import simplifyError from '../errorHandling/simplifyError'
import { TJwtPayload, TRole } from '../modules/auth/auth.user.interface'
import User from '../modules/auth/auth.user.model'
import { verifyToken } from '../modules/auth/auth.utils'

export default function Authentication(...requiredRoles: TRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization

      // * Step 1: Check if the Authorization header is present
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'You are not authorized!')
      }

      // * Step 2: Extract the token
      const token = authHeader.split(' ')[1]

      // * Step 3: Verify the token
      const decoded = verifyToken(token) as TJwtPayload

      if (!decoded) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid token!')
      }

      // * Validate the token payload
      const { email, userId, role } = decoded
      if (!email) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid email in token!')
      }

      if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid userId in token!')
      }

      if (!role) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Missing role in token!')
      }

      // * Check if the user exists
      const user = await User.findById(userId)
      const isUserExist = await User.findOne({ email })
      if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, 'This user is not found!')
      }

      if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, 'This user is not found!')
      }

      // * Check if the user is blocked
      if (user.isActive === false) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Your account is deactivated!')
      }

      // * Check if the user has the required role
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatusCode.UNAUTHORIZED,
          'You are not authorized to perform this action!'
        )
      }

      // * Attach user information to the request object
      req.user = decoded

      // * Move to the next middleware
      next()
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid token!'))
      } else {
        const errorResponse = simplifyError(error)
        sendError(res, errorResponse)
        next(error)
      }
    }
  }
}
