import { Request, Response, NextFunction } from 'express'

import { httpStatusCode } from '../../enum/statusCode'
import sendError from '../../errorHandling/sendError'
import simplifyError from '../../errorHandling/simplifyError'
import successResponse from '../../res/success.res'
import sendResponse from '../../utils/sendResponse'

import { orderServices } from './order.services'

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.createOrderService(req.body)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Order created successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.getMyOrdersService(req.params.email)

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Orders retrieved successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const calculateRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.calculateRevenueService()

    successResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Revenue calculated successfully.',
      data: {
        revenue: result
      }
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

export const orderController = {
  createOrder,
  getMyOrders,
  calculateRevenue
}
