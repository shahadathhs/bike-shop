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
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

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
                  <Badge variant="outline">{order.isDeleted ? 'cancelled' : order.status}</Badge>
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {/* mark as delivered => soft updating status */}
                  {order?.status !== 'delivered' && !order?.isDeleted && (
                    <fetcher.Form method="patch">
                      <input type="hidden" name="orderId" value={order._id} />
                      <input type="hidden" name="action" value="markAsDelivered" />
                      <Button type="submit" size="sm" variant={'outline'}>
                        Delivered
                      </Button>
                    </fetcher.Form>
                  )}

                  {/* delete order => hard delete */}
                  {(order?.status === 'delivered' || order?.isDeleted) && (
                    <fetcher.Form method="delete">
                      <input type="hidden" name="orderId" value={order._id} />
                      <input type="hidden" name="action" value="delete" />
                      <Button type="submit" size="sm" variant={'destructive'}>
                        Delete
                      </Button>
                    </fetcher.Form>
                  )}

                  {/* cancel order => soft delete */}
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
