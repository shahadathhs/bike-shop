import mongoose, { Document } from 'mongoose'

export type TRole = 'admin' | 'customer'

export type TJwtPayload = {
  email: string
  userId: mongoose.Types.ObjectId
  role: TRole
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: TRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  matchPassword(enteredPassword: string): Promise<boolean>
  updatePassword(newPassword: string): Promise<void>
  toProfileJSON(): {
    id: string
    name: string
    email: string
    role: TRole
    password: string
  }
  isAdmin(): boolean
}
