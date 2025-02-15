import mongoose, { Schema } from 'mongoose'

import { orderStatusEnum } from './order.helper'
import { IOrder } from './order.interface'

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      ref: 'User'
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: orderStatusEnum,
      default: 'pending'
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export const Order = mongoose.model<IOrder>('Order', orderSchema)
