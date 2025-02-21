import mongoose, { Schema, Model } from 'mongoose'

import { orderStatusEnum, TOrderStatus } from './order.helper'
import { IOrder } from './order.interface'

// Extend the IOrder interface with instance methods.
export interface IOrderMethods {
  markAsDelivered(): Promise<IOrder>
  cancelOrder(): Promise<IOrder>
  updateStatus(newStatus: TOrderStatus): Promise<IOrder>
}

// Define a custom OrderModel type that includes the instance methods.
type OrderModel = Model<IOrder, unknown, IOrderMethods>

const orderSchema = new Schema<IOrder, OrderModel, IOrderMethods>(
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

// Pre-save middleware to ensure that if the status is 'delivered', then isDelivered is set to true.
orderSchema.pre('save', function (next) {
  if (this.status === 'delivered') {
    this.isDelivered = true
  }
  next()
})

// Instance method: Mark the order as delivered.
orderSchema.methods.markAsDelivered = async function (): Promise<IOrder> {
  this.status = 'delivered'
  this.isDelivered = true
  return await this.save()
}

// Instance method: Cancel the order by marking it as deleted.
orderSchema.methods.cancelOrder = async function (): Promise<IOrder> {
  this.isDeleted = true
  return await this.save()
}

// Instance method: Update the order's status.
orderSchema.methods.updateStatus = async function (newStatus: TOrderStatus): Promise<IOrder> {
  this.status = newStatus
  if (newStatus === 'delivered') {
    this.isDelivered = true
  }
  return await this.save()
}

export const Order = mongoose.model<IOrder, OrderModel>('Order', orderSchema)
