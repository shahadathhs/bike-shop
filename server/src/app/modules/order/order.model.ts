import mongoose, { Schema } from 'mongoose'
import { IOrder } from './order.interface'

const orderSchema = new Schema<IOrder>(
  {
    email: {
      type: String,
      required: true,
      trim: true
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
    }
  },
  {
    timestamps: true
  }
)

export const Order = mongoose.model<IOrder>('Order', orderSchema)
