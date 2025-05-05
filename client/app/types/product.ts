export type ProductCard = {
  _id: string
  name: string
  description: string
  image: string
}

export type Product = {
  _id: string
  name: string
  description: string
  image: string
  price: number
  category: string
  rating: number
  reviews: number
  stock: number
}

export type TBike = {
  _id: string
  name: string
  brand: string
  modelName: string
  price: number
  category: string
  description: string
  image: string
  quantity: number 
  inStock?: boolean 
}