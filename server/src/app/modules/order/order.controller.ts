import { Request, Response, NextFunction } from 'express'

import errorResponse from '../../res/error.res'
import successResponse from '../../res/success.res'
import { BikeServices } from '../bike/bike.services'

import { IOrder } from './order.interface'
import { orderServices } from './order.services'


const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, product, quantity, totalPrice } = req.body

    // * check if bike exists
    const bike = await BikeServices.getBikeByIdService(product)
    if (!bike) {
      errorResponse(res, new Error('Bike not found.'), 'Bike not found.', 404)
      return
    }

    // * Check if the bike is in stock
    if (!bike.inStock) {
      errorResponse(res, new Error('Bike is not in stock.'), 'Bike is not in stock.', 400)
      return
    }

    // * Check if the bike has enough quantity
    if (bike.quantity < quantity) {
      errorResponse(
        res,
        new Error('Insufficient stock to complete the order.'),
        'Insufficient stock to complete the order.',
        400
      )
      return
    }

    // * Check if total price matches the calculated price
    if (totalPrice !== bike.price * quantity) {
      errorResponse(
        res,
        new Error('Total price does not match the calculated price.'),
        'Total price does not match the calculated price.',
        400
      )
      return
    }

    // * Call service to create order
    const order = await orderServices.createOrderService(bike, {
      email,
      product,
      quantity,
      totalPrice
    } as IOrder)

    successResponse(res, order, 'Order created successfully')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to create order')
    next(error)
  }
}

const calculateRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalRevenue = await orderServices.calculateRevenueService()
    successResponse(res, { totalRevenue }, 'Revenue calculated successfully')
  } catch (error) {
    errorResponse(res, error as Error, 'Failed to calculate revenue')
    next(error)
  }
}

export const orderController = {
  createOrder,
  calculateRevenue
}
