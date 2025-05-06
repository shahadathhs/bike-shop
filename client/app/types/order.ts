export interface OrderRow {
  _id: string
  product: { name: string }
  createdAt: string
  status: string
  totalPrice: number
  isDeleted: boolean
}