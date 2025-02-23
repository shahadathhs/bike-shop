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
}): Promise<{ token: string; name: string; email: string; role: string }> => {
  const { email, password } = payload

  // * try to get user data with password by email
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  if (user.isActive === false) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'Your account is deactivated')
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

  return {
    token,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

const deactivateUser = async (id: string): Promise<IUser> => {
  const updatedUser = await User.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

const updateProfile = async (id: string, payload: Partial<IUser>): Promise<IUser> => {
  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

export const AuthService = {
  registerUser,
  loginUser,
  deactivateUser,
  updateProfile
}
