import mongoose, { Document } from 'mongoose'

import { TOrderStatus } from './order.helper'

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
