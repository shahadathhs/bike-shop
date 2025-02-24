import { Request, Response, NextFunction } from 'express'

import { httpStatusCode } from '../../enum/statusCode'
import sendError from '../../errorHandling/sendError'
import simplifyError from '../../errorHandling/simplifyError'
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
const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.getOrderByIdService(req.params.id)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Order retrieved successfully.',
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
    const result = await orderServices.getMyOrdersService(
      req.params.email,
      Number(req.query.page),
      Number(req.query.limit)
    )

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

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.updateOrderService(req.params.id, req.body)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Order updated successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.updateOrderStatusService(req.params.id, req.body)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Order status updated successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.deleteOrderService(req.params.id)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Order deleted successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.cancelOrderService(req.params.id)
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Order cancelled successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.getAllOrdersService(req.query)
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

    sendResponse(res, {
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

const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderServices.getAnalyticsService()

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: 'Analytics retrieved successfully.',
      data: result
    })
  } catch (error) {
    const errorResponse = simplifyError(error)
    sendError(res, errorResponse)
    next(error)
  }
}

export const orderController = {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  getAllOrders,
  calculateRevenue,
  getAnalytics
}
