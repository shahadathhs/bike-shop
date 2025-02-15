import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'
import { BikeServices } from '../bike/bike.services'

import { IOrder } from './order.interface'
import { Order } from './order.model'

const createOrderService = async (payload: IOrder): Promise<IOrder> => {
  const { product, quantity, totalPrice } = payload

  // * check if bike exists
  const bike = await BikeServices.getBikeByIdService(product.toString())
  if (!bike) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Bike not found.')
  }

  // * Check if the bike is in stock
  if (!bike.inStock) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Bike is out of stock.')
  }

  // * Check if the bike has enough quantity
  if (bike.quantity < quantity) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Not enough quantity.')
  }

  // * Check if total price matches the calculated price
  if (totalPrice !== bike.price * quantity) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      'Total price does not match the calculated price.'
    )
  }

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

const getMyOrdersService = async (email: string): Promise<IOrder[]> => {
  const orders = await Order.find({ 'customer.email': email })
  return orders
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
  getMyOrdersService,
  calculateRevenueService
}
