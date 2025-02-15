import { Document } from 'mongoose'

import { TBikeCategory, TBikeModel } from './bike.helper'

export interface IBike extends Document {
  name: string
  brand: string
  modelName: TBikeModel
  price: number
  category: TBikeCategory
  description: string
  quantity: number // * Represents the current available stock
  inStock?: boolean // * Should be computed from quantity
}
