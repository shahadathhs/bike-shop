import { IBike } from '../bike/bike.interface'

import { IOrder } from './order.interface'
import { Order } from './order.model'

/**
 * Creates a new order and updates bike inventory.
 *
 * This service function handles the creation of a new order
 * and simultaneously updates the inventory of the specified bike.
 * It reduces the bike's quantity by the ordered amount and updates
 * the inStock status if the quantity reaches zero.
 *
 * @param bike - The bike object to be updated, adhering to the IBike interface.
 * @param payload - The order data to be created, adhering to the IOrder interface.
 * @returns A promise that resolves to the created order object.
 */
const createOrderService = async (
  bike: IBike,
  payload: IOrder
): Promise<IOrder> => {
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

/**
 * Calculates the total revenue from all orders.
 *
 * This function uses MongoDB's aggregation framework to sum
 * up the totalPrice field of all order documents in the Order collection.
 *
 * @returns A promise that resolves to the total revenue as a number.
 *          If no orders exist, it returns 0.
 */
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
