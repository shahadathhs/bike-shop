import { getCookie } from '~/services/auth.services'
import type { TCookie } from '~/types/user'

import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useNavigation,
  redirect,
  type LoaderFunction,
  type ActionFunction,
  useFetcher,
} from 'react-router'
import { Input } from '~/components/ui/input'
import { useEffect, useState } from 'react'
import { useDebounce } from '~/utils/debounce'

// Types for loader data
interface User {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
}

interface LoaderData {
  users: User[]
  metadata: { total: number; page: number; limit: number }
  cookie: TCookie
}

// Loader to fetch users with pagination and optional email filter
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)
  if (!cookie.token) return redirect('/login')

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? '1')
  const limit = Number(url.searchParams.get('limit') ?? '10')
  const email = url.searchParams.get('email') ?? ''

  try {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    if (email) params.set('email', email)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/getAll?${params.toString()}`, {
      headers: { Authorization: `Bearer ${cookie.token}` },
    })

    const responseData = await res.json()

    return {
      users: responseData.data.users,
      metadata: responseData.data.metadata,
      cookie,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error fetching users:', err)
    return { users: [], metadata: { total: 0, page, limit }, cookie }
  }
}

// Action to toggle user active status or role
export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCookie(request)
  if (!cookie.token) return redirect('/login')

  const formData = await request.formData()
  const actionType = formData.get('action')
  const userId = formData.get('userId')

  if (actionType === 'toggleActive') {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/${userId}/active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.token}`,
      },
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'Failed to update user status')
    }
  }

  if (actionType === 'toggleRole') {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.token}`,
      },
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'Failed to update user role')
    }
  }

  return null
}

// Component to render users table with filters and pagination
export default function Users() {
  const { users, metadata } = useLoaderData<LoaderData>()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const fetcher = useFetcher()

  const page = Number(metadata.page)
  const limit = Number(metadata.limit)
  const total = Number(metadata.total)
  const totalPages = Math.ceil(total / limit)
  const isLoading = navigation.state !== 'idle'
  const isSubmitting = fetcher.state === 'submitting'

  function go(params: { page?: number; limit?: number; email?: string }) {
    const p = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value == null || value === '') p.delete(key)
      else p.set(key, String(value))
    })
    navigate(`?${p.toString()}`)
  }

  const [term, setTerm] = useState(searchParams.get('email') ?? '')
  const debouncedTerm = useDebounce(term, 500)

  // effect to navigate on debounce
  useEffect(() => {
    const p = new URLSearchParams(searchParams)
    if (debouncedTerm) p.set('searchTerm', debouncedTerm)
    else p.delete('searchTerm')
    p.set('page', '1')
    navigate(`?${p}`)
  }, [debouncedTerm])

  return (
    <div className='p-2'>
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      {/* Email Filter Input */}
      <div className="mb-4 max-w-md">
        <Input
          type="email"
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="Filter by email"
        />
      </div>

      {/* Loading State */}
      {(isLoading || isSubmitting) && <p>Loading users...</p>}

      {/* No Users */}
      {!isLoading && users.length === 0 && <p>No users found.</p>}

      {/* Users Table */}
      {users.length > 0 && (
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
              {users?.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="flex gap-2">
                    <fetcher.Form method="post">
                      <input type="hidden" name="action" value="toggleActive" />
                      <input type="hidden" name="userId" value={user._id} />
                      <button className="btn btn-info btn-sm" disabled={isSubmitting}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </fetcher.Form>
                    <fetcher.Form method="post">
                      <input type="hidden" name="action" value="toggleRole" />
                      <input type="hidden" name="userId" value={user._id} />
                      <button className="btn btn-error btn-sm" disabled={isSubmitting}>
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
          onClick={() => go({ page: page - 1 })}
          disabled={page === 1}
          className="btn btn-outline btn-sm"
        >
          Previous
        </button>
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => go({ page: page + 1 })}
          disabled={page >= totalPages}
          className="btn btn-outline btn-sm"
        >
          Next
        </button>
        <select
          value={limit}
          onChange={e => go({ limit: Number(e.target.value), page: 1 })}
          className="select select-bordered btn-sm"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>
  )
}
