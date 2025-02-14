export const orderStatusEnum = ['pending', 'processing', 'shipped', 'delivered'] as const

// * Infer the types from enums using typeof and array indexing
export type TOrderStatus = (typeof orderStatusEnum)[number]


/**
 * Interface for revenue summary analytics.
 */
export interface IRevenueSummary {
  totalRevenue: number // Total revenue earned
  totalOrders: number // Total number of orders
  averageOrderValue: number // Average revenue per order
  revenueByPeriod?: {
    // Optional breakdown by period
    daily?: { [date: string]: number }
    monthly?: { [month: string]: number }
    yearly?: { [year: string]: number }
  }
}

/**
 * Interface for order status summary analytics.
 */
export interface IOrderStatusSummary {
  pending: number
  processing: number
  shipped: number
  delivered: number
}

/**
 * Interface for order analytics, such as counts by date.
 */
export interface IOrderAnalytics {
  ordersByStatus: IOrderStatusSummary // Summary of orders by status
  ordersByDate: { [date: string]: number } // Orders grouped by date (e.g., "2025-02-14": 10)
}

/**
 * Combined analytics interface that includes revenue and order analytics.
 */
export interface IAnalytics {
  revenueSummary: IRevenueSummary
  orderAnalytics: IOrderAnalytics
}
