import mongoose, { Schema } from 'mongoose'

import { bikeBrandEnum, bikeCategoryEnum, bikeModelEnum } from './bike.helper'
import { IBike } from './bike.interface'

const BikeSchema: Schema<IBike> = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, enum: bikeBrandEnum, required: true },
    modelName: { type: String, enum: bikeModelEnum, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: bikeCategoryEnum, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, required: true }
  },
  { timestamps: true }
)

// Pre-save middleware to calculate inStock based on quantity
BikeSchema.pre<IBike>('save', function (next) {
  this.inStock = this.quantity > 0
  next()
})

export const Bike = mongoose.model<IBike>('Bike', BikeSchema)
