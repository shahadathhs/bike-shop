import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { getToken } from '~/utils/getToken'

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

export default function Analytics() {
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  const token = getToken()

  useEffect(() => {
    if (!token) {
      toast.error('Authentication required')
      navigate('/auth/login')
      return
    }

    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/admin/analytics`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()
        setAnalytics(data.data)
      } catch (err: any) {
        console.error('Error fetching analytics:', err)
        setError(err.message || 'Failed to fetch analytics data')
        toast.error(err.message || 'Failed to fetch analytics data')
      }
      setLoading(false)
    }

    fetchAnalytics()
  }, [token, navigate])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Analytics Dashboard</h1>

      {loading && (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {analytics && (
        <div className="space-y-8">
          {/* Revenue Summary Card */}
          <div className="shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Revenue Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-box border border-base-content/5 bg-base-100">
                <p className="text-gray-400">Total Revenue</p>
                <p className="text-2xl font-semibold">
                  ${analytics.revenueSummary.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-box border border-base-content/5 bg-base-100">
                <p className="text-gray-400">Total Orders</p>
                <p className="text-2xl font-semibold">{analytics.revenueSummary.totalOrders}</p>
              </div>
              <div className="p-4 rounded-box border border-base-content/5 bg-base-100">
                <p className="text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-semibold">
                  ${analytics.revenueSummary.averageOrderValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Orders by Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Orders by Status</h2>
              <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="w-full table table-zebra">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analytics.orderAnalytics.ordersByStatus).map(
                      ([status, count]) => (
                        <tr key={status}>
                          <td>{status}</td>
                          <td>{count}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders by Date */}
            <div className="shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Orders by Date</h2>
              <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="w-full table table-zebra">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analytics.orderAnalytics.ordersByDate).map(([date, count]) => (
                      <tr key={date}>
                        <td>{date}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
