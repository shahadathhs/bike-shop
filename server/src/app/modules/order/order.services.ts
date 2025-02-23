import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'
import { BikeServices } from '../bike/bike.services'

import { IAnalytics, IOrderAnalytics, IRevenueSummary, TOrderStatus } from './order.helper'
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
  const savedOrder = await order.save()
  // Now, populate the 'product' field by querying the saved order:
  const populatedOrder = await Order.findById(savedOrder._id).populate('product')
  if (!populatedOrder) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Order not found.')
  }
  return populatedOrder
}

const getOrderByIdService = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findById(id)

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Order not found.')
  }

  return result
}

const getMyOrdersService = async (
  email: string,
  page: number = 1,
  limit: number = 10
): Promise<IOrder[]> => {
  const skip = (page - 1) * limit
  const orders = await Order.find({ email }).populate('product').skip(skip).limit(limit)
  return orders
}

const updateOrderService = async (id: string, payload: Partial<IOrder>): Promise<IOrder | null> => {
  const order = await Order.findById(id)

  if (!order) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Order not found.')
  }

  // * Update the order
  Object.assign(order, payload)
  const result = await order.save()
  return result
}

const updateOrderStatusService = async (
  id: string,
  status: TOrderStatus
): Promise<IOrder | null> => {
  const order = await Order.findById(id)

  if (!order) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Order not found.')
  }

  // * Update the order status
  order.status = status
  const result = await order.save()
  return result
}

const deleteOrderService = async (id: string): Promise<IOrder | null> => {
  const result = await Order.findByIdAndDelete(id)

  if (!result) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Order not found.')
  }
  return result
}

const cancelOrderService = async (id: string): Promise<IOrder | null> => {
  const order = await Order.findById(id)

  if (!order) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Order not found.')
  }

  // * make isDeleted true
  order.isDeleted = true
  const result = await order.save()
  return result
}

const getAllOrdersService = async (): Promise<IOrder[]> => {
  const result = await Order.find()
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

const getAnalyticsService = async (): Promise<IAnalytics> => {
  // Calculate revenue summary
  const revenueAgg = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalOrders: 1,
        averageOrderValue: {
          $cond: [{ $eq: ['$totalOrders', 0] }, 0, { $divide: ['$totalRevenue', '$totalOrders'] }]
        }
      }
    }
  ])

  const revenueSummary: IRevenueSummary = revenueAgg[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueByPeriod: {}
  }

  // Calculate orders by status
  const statusAgg = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])

  // Initialize counts for all expected statuses
  const ordersByStatus = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  }

  statusAgg.forEach((item: { _id: string; count: number }) => {
    if (item._id in ordersByStatus) {
      ;(ordersByStatus as Record<string, number>)[item._id] = item.count
    }
  })

  // Calculate orders grouped by creation date (formatted as YYYY-MM-DD)
  const ordersByDateAgg = await Order.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  const ordersByDate: { [date: string]: number } = {}
  ordersByDateAgg.forEach((item: { _id: string; count: number }) => {
    ordersByDate[item._id] = item.count
  })

  // Combine the order analytics into one interface
  const orderAnalytics: IOrderAnalytics = {
    ordersByStatus,
    ordersByDate
  }

  const analytics: IAnalytics = {
    revenueSummary,
    orderAnalytics
  }

  return analytics
}

export const orderServices = {
  createOrderService,
  getOrderByIdService,
  getMyOrdersService,
  updateOrderService,
  updateOrderStatusService,
  deleteOrderService,
  cancelOrderService,
  getAllOrdersService,
  calculateRevenueService,
  getAnalyticsService
}
