import mongoose, { Document } from 'mongoose'

export interface IOrder extends Document {
  email: string
  product: mongoose.Schema.Types.ObjectId
  quantity: number
  totalPrice: number
}
