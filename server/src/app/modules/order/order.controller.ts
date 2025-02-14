import { Request, Response, NextFunction } from 'express'

import errorResponse from '../../res/error.res'
import successResponse from '../../res/success.res'
import { bikeServices } from '../bike/bike.services'

import { IOrder } from './order.interface'
import { orderServices } from './order.services'

/**
 * Handles POST requests for creating a new order.
 *
 * Receives the order data in the request body, including the email, product
 * ID, quantity, and total price. Validates the data and checks if the bike
 * exists, is in stock, has enough quantity, and the total price matches the
 * calculated price. If valid, creates the order and sends a success response
 * with the created order details. On failure, sends an error response detailing
 * the failure reason.
 *
 * @param req - The HTTP request object containing order data in its body.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, product, quantity, totalPrice } = req.body

    // * check if bike exists
    const bike = await bikeServices.getBikeByIdService(product)
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
/**
 * Handles GET requests for calculating the total revenue from all orders.
 *
 * This function uses MongoDB's aggregation framework to sum
 * up the totalPrice field of all order documents in the Order collection.
 *
 * On success, sends a success response with the total revenue as a number.
 *          If no orders exist, it returns 0.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send back the desired response.
 * @param next - The next middleware function in the Express request-response cycle.
 */
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
