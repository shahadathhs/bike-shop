import { NextFunction, Request, Response } from 'express'

import { httpStatusCode } from '../../enum/statusCode'
import sendError from '../../errorHandling/sendError'
import simplifyError from '../../errorHandling/simplifyError'
import sendResponse from '../../utils/sendResponse'

import { AuthService } from './auth.service'

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.registerUser(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: 'Registration successful.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.loginUser(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Login successful.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await AuthService.deactivateUser(id)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User deactivated successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    console.log("user", user)
    const { userId : id } = user
    const result = await AuthService.updateProfile(id, req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'User profile updated successfully.',
      data: result
    })
    next()
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}
export const AuthController = {
  registerUser,
  loginUser,
  deactivateUser,
  updateProfile
}
