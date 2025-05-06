import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import {
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type ActionFunction,
  type LoaderFunction,
} from 'react-router'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { orderStatus } from '~/constant/order'
import { getCookie } from '~/services/auth.services'
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

interface OrderRow {
  _id: string
  product: { name: string }
  createdAt: string
  status: string
  totalPrice: number
  isDeleted: boolean
}

interface LoaderData {
  orders: OrderRow[]
  metadata: { total: number; page: number; limit: number }
  cookie: TCookie
}

export default function Orders() {
  const { orders, metadata } = useLoaderData<LoaderData>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = metadata.page
  const limit = metadata.limit
  const totalPages = Math.ceil(metadata.total / limit)
  const currentStatus = searchParams.get('status') ?? ''
  const searchTerm = searchParams.get('searchTerm') ?? ''

  const fetcher = useFetcher()

  // helper to build new URLSearchParams string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function go(params: Record<string, any>) {
    const p = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === '') p.delete(k)
      else p.set(k, String(v))
    })
    navigate(`?${p.toString()}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      {/* Search & Status Filter */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        {/* Search Input */}
        <div>
          <Input
            type="text"
            value={searchTerm}
            onChange={e => {
              go({ searchTerm: e.target.value })
            }}
            placeholder="Search orders by name, category, or brand"
          />
        </div>
        {/* Status Filter */}
        <Select
          value={currentStatus}
          onValueChange={v => go({ status: v === 'all' ? undefined : v, page: 1 })}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {orderStatus.map(s => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto border rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length > 0 ? (
              orders.map(order => (
                <TableRow key={order._id}>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {/* mark as delivered */}
                    {order?.status !== 'delivered' && !order?.isDeleted && (
                      <fetcher.Form method="patch">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="action" value="markAsDelivered" />
                        <Button type="submit" size="sm" variant={'outline'}>
                          Delivered
                        </Button>
                      </fetcher.Form>
                    )}

                    {/* delete order */}
                    {(order?.status === 'delivered' || order?.isDeleted) && (
                      <fetcher.Form method="delete">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="action" value="delete" />
                        <Button type="submit" size="sm" variant={'destructive'}>
                          Delete
                        </Button>
                      </fetcher.Form>
                    )}

                    {/* cancel order */}
                    {order?.status !== 'delivered' && !order?.isDeleted && (
                      <fetcher.Form method="patch">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="action" value="cancel" />
                        <Button type="submit" size="sm">
                          Cancel
                        </Button>
                      </fetcher.Form>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            {/* pagination */}
            <TableRow>
              <TableHead>
                <div className="flex items-center space-x-2">
                  <Button size="sm" disabled={page <= 1} onClick={() => go({ page: page - 1 })}>
                    <ArrowBigLeft />
                  </Button>
                  <span>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <Button
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => go({ page: page + 1 })}
                  >
                    <ArrowBigRight />
                  </Button>
                </div>
              </TableHead>
              <TableHead colSpan={4}>
                <Select value={String(limit)} onValueChange={v => go({ limit: v, page: 1 })}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[6, 12, 18].map(n => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
