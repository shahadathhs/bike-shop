import { toast } from 'sonner'
import { getCookie } from '~/services/auth.services'
import type { TCookie } from '~/types/user'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Link, redirect, useLoaderData, useSearchParams, type LoaderFunction } from 'react-router'

interface LoaderData {
  orders: Array<{
    _id: string
    product: { name: string }
    createdAt: string
    status: string
    totalPrice: number
  }>
  metadata: { total: number; page: number; limit: number }
  cookie: TCookie
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 8)

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/myOrders/${cookie.email}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${cookie.token}` },
      },
    )
    if (!res.ok) throw new Error('Fetch failed')

    const { data } = await res.json()
    return {
      orders: data.orders,
      metadata: data.metadata,
      cookie,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error fetching orders:', err)
    // You might surface this in the UI via useCatch()/CatchBoundary
    toast.error('Failed to load orders. Please try again.', { duration: 5000 })
    return { orders: [], metadata: { total: 0, page, limit }, cookie }
  }
}

export default function CustomerOrders() {
  const { orders, metadata } = useLoaderData<LoaderData>()
  const [searchParams] = useSearchParams()

  const page = metadata.page
  const limit = metadata.limit
  const totalPages = Math.ceil(metadata.total / limit)

  const makeLink = (newPage: number, newLimit = limit) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    params.set('limit', String(newLimit))
    return `?${params.toString()}`
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-semibold">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground">No orders found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order._id}>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{order._id}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('en-US')}</TableCell>
                <TableCell>
                  <Badge variant="outline">{order.status}</Badge>
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableHead colSpan={4}>Total</TableHead>
              <TableHead>
                ${orders.reduce((acc, order) => acc + order.totalPrice, 0).toFixed(2)}
              </TableHead>
            </TableRow>

            <TableRow>
              {/* Pagination & Limit Controls */}
              <div className="flex flex-wrap items-center justify-between space-y-2">
                <div className="space-x-2">
                  <Button size="sm" asChild disabled={page <= 1}>
                    <Link to={makeLink(page - 1)}>Previous</Link>
                  </Button>
                  <span>
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <Button size="sm" asChild disabled={page >= totalPages}>
                    <Link to={makeLink(page + 1)}>Next</Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span>Per page:</span>
                  <Select
                    value={String(limit)}
                    onValueChange={val => window.location.replace(makeLink(1, Number(val)))}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                      {[8, 16, 24].map(n => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  )
}
