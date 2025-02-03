import { Document } from 'mongoose'

export interface IBike extends Document {
  name: string
  brand: string
  price: number
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric'
  description: string
  quantity: number
  inStock: boolean
}
