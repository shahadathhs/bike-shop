import type { OrderRow } from '~/types/order'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
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
import { useFetcher, useNavigate, useSearchParams } from 'react-router'
import { ArrowBigLeft, ArrowBigRight, MenuIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export default function OrderTable({
  orders,
  metadata,
}: {
  orders: OrderRow[]
  metadata: { total: number; page: number; limit: number }
}) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = Number(metadata.page)
  const limit = Number(metadata.limit)
  const totalPages = Math.ceil(metadata.total / limit)

  const fetcher = useFetcher()
  // const isSubmitting = fetcher.state === 'submitting'

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

  const statusColorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
  }

  return (
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
                  <Badge
                    className={statusColorMap[order.isDeleted ? 'cancelled' : order.status]}
                    variant="outline"
                  >
                    {order.isDeleted ? 'cancelled' : order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MenuIcon />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {/* mark as delivered => soft updating status */}
                      {order?.status !== 'delivered' && !order?.isDeleted && (
                        <DropdownMenuItem>
                          <fetcher.Form method="patch">
                            <input type="hidden" name="orderId" value={order._id} />
                            <input type="hidden" name="action" value="markAsDelivered" />
                            <button type="submit" className="text-green-600 text-sm">
                              Mark As Delivered
                            </button>
                          </fetcher.Form>
                        </DropdownMenuItem>
                      )}

                      {/* delete order => hard delete */}
                      {(order?.status === 'delivered' || order?.isDeleted) && (
                        <DropdownMenuItem>
                          <fetcher.Form method="delete">
                            <input type="hidden" name="orderId" value={order._id} />
                            <input type="hidden" name="action" value="delete" />
                            <button type="submit" className="text-red-600 text-sm">
                              Delete Order
                            </button>
                          </fetcher.Form>
                        </DropdownMenuItem>
                      )}

                      {/* cancel order => soft delete */}
                      {order?.status !== 'delivered' && !order?.isDeleted && (
                        <DropdownMenuItem>
                          <fetcher.Form method="patch">
                            <input type="hidden" name="orderId" value={order._id} />
                            <input type="hidden" name="action" value="cancel" />
                            <button type="submit" className="text-indigo-600 text-sm">
                              Cancel Order
                            </button>
                          </fetcher.Form>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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

        {/* pagination */}
        <TableFooter>
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
            <TableHead colSpan={5}>
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
  )
}
