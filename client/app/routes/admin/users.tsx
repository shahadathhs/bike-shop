/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useFetcher, type ActionFunction } from 'react-router'
import { getToken } from '~/utils/getToken'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const action = formData.get('action')
  const token = formData.get('token')

  // * action the toggle user active status
  if (action === 'toggleActive') {
    const userId = formData.get('userId')

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/${userId}/active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error || 'Failed to update user status')
    }
  }
  // * action the toggle user role
  if (action === 'toggleRole') {
    const id = formData.get('userId')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/${id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error || 'Failed to update user role')
    }
  }
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailFilter, setEmailFilter] = useState('')

  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  const token = getToken()

  // Fetch users with pagination and optional email filtering.
  const fetchUsers = async (page = 1, limit = 10, email = '') => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      // Append the email query parameter if provided.
      if (email) {
        queryParams.append('email', email)
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/getAll?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to fetch users')
      }
      const responseData = await response.json()
      setUsers(responseData.data.users)
      setTotal(responseData.data.metadata.total)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to fetch users')
      toast.error(err.message || 'Failed to fetch users')
    }
    setLoading(false)
  }

  // Fetch users on state changes.
  useEffect(() => {
    if (token) {
      fetchUsers(page, limit, emailFilter)
    }
  }, [token, page, limit, emailFilter, isSubmitting])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      {/* Email Filter Input */}
      <div className="mb-4">
        <input
          type="email"
          value={emailFilter}
          onChange={e => {
            setPage(1) // Reset to first page on filter change.
            setEmailFilter(e.target.value)
          }}
          placeholder="Filter by email"
          className="input input-bordered"
        />
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="w-full table table-zebra">
            <thead className="bg-gray-200">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="flex gap-2">
                    {/* toggle user active status */}
                    <fetcher.Form method="post">
                      <input type="hidden" name="token" value={token as string} />
                      <input type="hidden" name="action" value="toggleActive" />
                      <input type="hidden" name="userId" value={user._id} />
                      <button className="btn btn-info btn-sm">
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </fetcher.Form>

                    {/* toggle user role */}
                    <fetcher.Form method="post">
                      <input type="hidden" name="token" value={token as string} />
                      <input type="hidden" name="action" value="toggleRole" />
                      <input type="hidden" name="userId" value={user._id} />
                      <button className="btn btn-error btn-sm">
                        Make {user.role === 'customer' ? 'Admin' : 'Customer'}
                      </button>
                    </fetcher.Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-end gap-4 items-center mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="btn btn-outline btn-sm"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))}
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages}
        >
          Next
        </button>
        <div>
          <select
            value={limit}
            onChange={e => {
              setPage(1) // Reset page when limit changes.
              setLimit(parseInt(e.target.value))
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
