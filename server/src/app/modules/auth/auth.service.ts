import mongoose from 'mongoose'

import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'

import { IUser, TJwtPayload } from './auth.user.interface'
import User from './auth.user.model'
import { createToken } from './auth.utils'

const registerUser = async (payload: IUser): Promise<Partial<IUser>> => {
  const user = await User.create(payload)
  const userWithoutPassword = { ...user.toJSON(), password: undefined }
  return userWithoutPassword
}

const loginUser = async (payload: {
  email: string
  password: string
}): Promise<{ token: string }> => {
  const { email, password } = payload

  // * try to get user data with password by email
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  if (user.isActive === false) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'User is blocked')
  }
  // * Compare password
  const isPasswordMatched = await user.matchPassword(password)

  if (!isPasswordMatched) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid credentials')
  }
  // * Generate token payload
  const jwtPayload: TJwtPayload = {
    email: user.email,
    userId: user._id as mongoose.Types.ObjectId,
    role: user.role
  }
  // * Generate token
  const token = createToken(jwtPayload)

  return { token }
}

export const AuthService = {
  registerUser,
  loginUser
}
