/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { redirect, type LoaderFunction } from 'react-router'
import { toast } from 'sonner'
import { useAuth } from '~/context/AuthContext'
import { getCookie } from '~/services/auth.services'

export const loader: LoaderFunction = async ({ request }) => {
  const cookies = await getCookie(request)
  const token = cookies.token

  if (!token) {
    return redirect('/login')
  } else {
    return null
  }
}

export default function CustomerOrders() {
  const { token, email } = useAuth()
  const [orders, setOrders] = useState([])
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Fetch orders for the logged in user with pagination
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/myOrders/${email}?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const responseData = await response.json()
        console.log('responseData', responseData)
        setOrders(responseData.data.orders)
        setMetadata(responseData.data.metadata)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to fetch orders')
        toast.error('Failed to fetch orders', {
          duration: 5000,
          description: 'Please try again later.',
        })
      }
      setLoading(false)
    }

    if (token) {
      fetchOrders()
    }
  }, [page, limit])

  // Calculate total pages from metadata.total and limit.
  const totalPages = Math.ceil(metadata.total / limit)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className=" w-full table table-zebra">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id}>
                  <td>{order.product.name}</td>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>${order.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-4 mt-4">
        <button
          onClick={() => setPage(prev => prev - 1)}
          className="btn btn-outline btn-sm"
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => prev + 1)}
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages}
        >
          Next
        </button>
        <div>
          <select
            value={limit}
            onChange={e => {
              setLimit(parseInt(e.target.value))
              setPage(1)
            }}
            className="select select-bordered btn-sm"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  )
}
