import { redirect, useLoaderData, type LoaderFunction } from 'react-router'
import { getCookie } from '~/services/auth.services'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table'

interface IRevenueSummary {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  revenueByPeriod?: Record<string, number>
}

interface IOrderStatusSummary {
  pending: number
  processing: number
  shipped: number
  delivered: number
}

interface IOrderAnalytics {
  ordersByStatus: IOrderStatusSummary
  ordersByDate: Record<string, number>
}

interface IAnalytics {
  revenueSummary: IRevenueSummary
  orderAnalytics: IOrderAnalytics
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/admin/analytics`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    const data = await response.json()
    return {
      success: true,
      analytics: data.data,
      message: 'Analytics fetched successfully',
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error fetching analytics:', err)
    return {
      success: false,
      analytics: null,
      message: err.message || 'Failed to fetch analytics data',
    }
  }
}

export default function Analytics() {
  const { analytics } = useLoaderData<{ analytics: IAnalytics }>()

  return (
    <div>
      <h1 className="text-3xl text-center font-bold mb-6">Analytics Dashboard</h1>

      {analytics && (
        <div className="space-y-8">
          {/* Revenue Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Revenue Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded p-2">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${analytics.revenueSummary.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="border rounded p-2">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{analytics.revenueSummary.totalOrders}</p>
              </div>
              <div className="border rounded p-2">
                <p className="text-sm text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold">
                  ${analytics.revenueSummary.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Orders by Status and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Orders by Status</h2>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(analytics.orderAnalytics.ordersByStatus).map(
                      ([status, count]) => (
                        <TableRow key={status}>
                          <TableCell className="capitalize">{status}</TableCell>
                          <TableCell>{count}</TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Orders by Date</h2>
              <div className="rounded border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Orders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(analytics.orderAnalytics.ordersByDate).map(([date, count]) => (
                      <TableRow key={date}>
                        <TableCell>{date}</TableCell>
                        <TableCell>{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Pie Chart for order by status */}

          {/* Line Chart for orders by date */}

          {/* Chart for revenue summary */}
        </div>
      )}
    </div>
  )
}
