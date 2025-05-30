import bcrypt from 'bcryptjs'
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

const updateProfile = async (id: string, payload: Partial<IUser>): Promise<{ token: string; name: string; email: string; role: string }> => {
  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  // * Generate token payload
  const jwtPayload: TJwtPayload = {
    email: updatedUser.email,
    userId: updatedUser._id as mongoose.Types.ObjectId,
    role: updatedUser.role
  }
  // * Generate token
  const token = createToken(jwtPayload)

  return  {
    token,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role
  }
}
const updatePassword = async (
  id: string,
  payload: { currentPassword: string; newPassword: string }
): Promise<{ token: string; name: string; email: string; role: string }>  => {
  const { currentPassword, newPassword } = payload
  const user = await User.findById(id).select('+password')
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)
  if (!isPasswordMatched) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid credentials')
  }
  const salt = await bcrypt.genSalt(10)
  const updatedPassword = await bcrypt.hash(newPassword, salt)

  await User.findByIdAndUpdate(id, { password: updatedPassword }, { new: true })

  // Now fetch the updated user
  const updatedUser = await User.findById(id).select('+password')
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  const passwordMatch = await updatedUser.matchPassword(newPassword)
  if (!passwordMatch) {
    throw new AppError(httpStatusCode.INTERNAL_SERVER_ERROR, 'Password update failed')
  }

  // * Generate token payload
   const jwtPayload: TJwtPayload = {
    email: updatedUser.email,
    userId: updatedUser._id as mongoose.Types.ObjectId,
    role: updatedUser.role
  }
  // * Generate token
  const token = createToken(jwtPayload)

  return  {
    token,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role
  }
}
const getAllUsers = async (
  queryOptions: { email?: string; page?: number; limit?: number } = {}
): Promise<{ users: IUser[]; metadata: { total: number; page: number; limit: number } }> => {
  const { email, page = 1, limit = 10 } = queryOptions
  const filter: { email?: { $regex: string; $options: string } } = {}

  // If email is provided, search using case-insensitive regex.
  if (email) {
    filter.email = { $regex: email, $options: 'i' }
  }

  // Calculate how many documents to skip.
  const skip = (page - 1) * limit

  // Fetch the users with pagination.
  const users = await User.find(filter).skip(skip).limit(limit)
  // Get the total count of users matching the filter.
  const total = await User.countDocuments(filter)

  return {
    users,
    metadata: {
      total,
      page,
      limit
    }
  }
}

const updateRole = async (id: string): Promise<IUser> => {
  // * get the user by id
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  // * toggle the role
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: user.role === 'admin' ? 'customer' : 'admin' },
    { new: true }
  )
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

const updateActive = async (id: string): Promise<IUser> => {
  // * get the user by id
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  // * toggle the role
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { isActive: !user.isActive },
    { new: true }
  )
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

export const AuthService = {
  registerUser,
  loginUser,
  deactivateUser,
  updateProfile,
  updatePassword,
  getAllUsers,
  updateRole,
  updateActive
}
