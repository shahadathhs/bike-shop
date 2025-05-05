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
import {
  redirect,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type LoaderFunction,
} from 'react-router'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { orderStatus } from '~/constant/order'

interface OrderRow {
  _id: string
  product: { name: string }
  createdAt: string
  status: string
  totalPrice: number
}

interface LoaderData {
  orders: OrderRow[]
  metadata: { total: number; page: number; limit: number }
  cookie: TCookie
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 6)
  const status = url.searchParams.get('status') ?? ''

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/orders/myOrders/${cookie.email}` +
        `?page=${page}&limit=${limit}&status=${status}`,
      {
        headers: { Authorization: `Bearer ${cookie.token}` },
      },
    )
    if (!res.ok) throw new Error('Fetch failed')

    const { data } = await res.json()
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

export default function CustomerOrders() {
  const { orders, metadata } = useLoaderData<LoaderData>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = metadata.page
  const limit = metadata.limit
  const totalPages = Math.ceil(metadata.total / limit)
  const currentStatus = searchParams.get('status') ?? ''

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
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">My Orders</h1>

      {/* Search & Status Filter */}
      <div className="flex flex-wrap gap-4 items-center">
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

      <div className="overflow-x-auto border rounded">
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
            {orders.length > 0 ? (
              orders.map(o => (
                <TableRow key={o._id}>
                  <TableCell>{o.product.name}</TableCell>
                  <TableCell>{o._id}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{o.status}</Badge>
                  </TableCell>
                  <TableCell>${o.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            {/* total sum */}
            <TableRow>
              <TableHead colSpan={4}>Total</TableHead>
              <TableHead>
                ${orders.reduce((sum, { totalPrice }) => sum + totalPrice, 0).toFixed(2)}
              </TableHead>
            </TableRow>
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
