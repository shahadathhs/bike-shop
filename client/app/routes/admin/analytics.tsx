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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'

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

// Chart colors
const STATUS_COLORS = ['#6366F1', '#10B981', '#FBBF24', '#EF4444']

export default function Analytics() {
  const { analytics } = useLoaderData<{ analytics: IAnalytics }>()

  // Prepare data for charts
  const statusData = Object.entries(analytics.orderAnalytics.ordersByStatus).map(
    ([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }),
  )
  const dateData = Object.entries(analytics.orderAnalytics.ordersByDate).map(([date, value]) => ({
    date,
    value,
  }))
  const revenueData = analytics.revenueSummary.revenueByPeriod
    ? Object.entries(analytics.revenueSummary.revenueByPeriod).map(([period, amount]) => ({
        period,
        amount,
      }))
    : []

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

          {revenueData.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Revenue Over Time</h2>
              <div className="border rounded p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" tick={{ fill: '#4B5563', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#4B5563', fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ReTooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#6366F1"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orders by Status Pie Chart */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Orders by Status</h2>
              <div className="border rounded p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Orders by Date Line Chart */}
            <section>
              <h2 className="text-2xl font-semibold mb-3">Orders by Date</h2>
              <div className="border rounded p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dateData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fill: '#4B5563', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#4B5563', fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ReTooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
