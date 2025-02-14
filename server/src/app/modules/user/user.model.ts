import bcrypt from 'bcryptjs'
import mongoose, { Model, Schema } from 'mongoose'

import { IUser } from './user.interface'

// * User Schema
const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // * Exclude password field when querying by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    accountCreatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

// * Pre-save middleware to hash the password if modified or new
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next(error as any)
  }
})

// * Instance method to compare an entered password with the stored hashed password
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

// * Instance method to update the user's password
UserSchema.methods.updatePassword = async function (
  newPassword: string
): Promise<void> {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(newPassword, salt)
  await this.save()
}

// *  Instance method to get user profile with password
UserSchema.methods.toProfileJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    password: this.password // * Include password for profile retrieval
  }
}

// * Instance method to check if the user is an admin
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === 'admin'
}

// * Static method to find a user by email
UserSchema.statics.findByEmail = function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email })
}

// * Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
export default User
