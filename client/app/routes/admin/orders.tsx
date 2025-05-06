import { redirect, useLoaderData, type ActionFunction, type LoaderFunction } from 'react-router'
import { OrderSearch } from '~/components/admin/OrderSearch'
import OrderTable from '~/components/admin/OrderTable'
import { StatusFilter } from '~/components/admin/StatusFilter'
import { getCookie } from '~/services/auth.services'
import type { OrderRow } from '~/types/order'
import type { TCookie } from '~/types/user'

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 6)
  const status = url.searchParams.get('status') ?? ''
  const searchTerm = url.searchParams.get('searchTerm') ?? ''

  const queryParams = new URLSearchParams()
  queryParams.append('page', String(page))
  queryParams.append('limit', String(limit))
  if (status) queryParams.append('status', status)
  if (searchTerm) queryParams.append('searchTerm', searchTerm)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/admin/getAll?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookie.token}`,
        },
      },
    )

    const { data } = await response.json()
    console.log('data', data)
    return {
      orders: data.orders,
      metadata: data.metadata,
      cookie,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error fetching orders:', err)
    return { orders: [], metadata: { total: 0, page, limit }, cookie }
  }
}

export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')
  const token = cookie.token

  const formData = await request.formData()
  const action = formData.get('action') as string

  if (action === 'delete') {
    const orderId = formData.get('orderId') as string
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          message: 'Order deleted successfully',
          data: data,
        }
      } else {
        const errorData = await response.json()
        return {
          error: errorData.message || 'Failed to delete order',
          errorDetails: errorData,
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error deleting order:', err)
      return {
        error: err.message || 'Failed to delete order',
      }
    }
  }

  if (action === 'markAsDelivered') {
    const orderId = formData.get('orderId') as string
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'delivered' }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          message: 'Order marked as delivered successfully',
          data: data,
        }
      } else {
        const errorData = await response.json()
        return {
          error: errorData.message || 'Failed to mark order as delivered',
          errorDetails: errorData,
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error marking order as delivered:', err)
      return {
        error: err.message || 'Failed to mark order as delivered',
      }
    }
  }

  if (action === 'cancel') {
    const orderId = formData.get('orderId') as string
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          message: 'Order canceled successfully',
          data: data,
        }
      } else {
        const errorData = await response.json()
        return {
          error: errorData.message || 'Failed to cancel order',
          errorDetails: errorData,
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error canceling order:', err)
      return {
        error: err.message || 'Failed to cancel order',
      }
    }
  }

  return null
}

interface LoaderData {
  orders: OrderRow[]
  metadata: { total: number; page: number; limit: number }
  cookie: TCookie
}

export default function Orders() {
  const { orders, metadata } = useLoaderData<LoaderData>()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      {/* Search & Status Filter */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <OrderSearch />
        </div>
        <StatusFilter />
      </div>

      {/* Order Table */}
      <OrderTable orders={orders} metadata={metadata} />
    </div>
  )
}
