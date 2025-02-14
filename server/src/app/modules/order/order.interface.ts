import mongoose, { Document } from 'mongoose'

export type TOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered'

export interface IOrder extends Document {
  email: string
  product: mongoose.Schema.Types.ObjectId
  quantity: number
  totalPrice: number
  status: TOrderStatus
  isDelivered: boolean
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date
}
