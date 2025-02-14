import { IBike } from '../bike/bike.interface'

import { IOrder } from './order.interface'
import { Order } from './order.model'

const createOrderService = async (bike: IBike, payload: IOrder): Promise<IOrder> => {
  // * Reduce inventory and update inStock if necessary
  bike.quantity -= payload.quantity
  if (bike.quantity === 0) {
    bike.inStock = false
  }
  await bike.save()

  // * Create the order
  const order = new Order(payload)
  const result = await order.save()
  return result
}

 
const calculateRevenueService = async (): Promise<number> => {
  const revenueAggregation = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ])

  return revenueAggregation[0]?.totalRevenue || 0
}

export const orderServices = {
  createOrderService,
  calculateRevenueService
}
