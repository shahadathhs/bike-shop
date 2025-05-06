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
import { useEffect, useState } from 'react'
import { useDebounce } from '~/utils/debounce'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select'
import { Loader2 } from 'lucide-react'

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
    const data = await res.json()

    return { users: data.data.users, metadata: data.data.metadata, cookie }
  } catch (err) {
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

  const url = `${import.meta.env.VITE_API_URL}/auth/${userId}/${
    actionType === 'toggleActive' ? 'active' : 'role'
  }`

  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cookie.token}` },
  })

  if (!res.ok) {
    const errData = await res.json()
    throw new Error(errData.error || 'Failed to update user')
  }

  return null
}

function LoadingState({ label = 'Fetching Data' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Loader2 className="animate-spin h-8 w-8 text-primary mb-2" />
      <p className="text-lg font-medium">{label}</p>
    </div>
  )
}

function EmptyState({ label = 'No users found.' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-lg font-medium text-muted-foreground">{label}</p>
    </div>
  )
}

export default function Users() {
  const { users, metadata } = useLoaderData<LoaderData>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const fetcher = useFetcher()

  const page = metadata.page
  const limit = metadata.limit
  const total = metadata.total
  const totalPages = Math.ceil(total / limit)

  const isLoading = navigation.state !== 'idle'
  const isSubmitting = fetcher.state === 'submitting'

  const [term, setTerm] = useState(searchParams.get('email') ?? '')
  const debouncedTerm = useDebounce(term, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedTerm) params.set('email', debouncedTerm)
    else params.delete('email')
    params.set('page', '1')
    navigate(`?${params.toString()}`)
  }, [debouncedTerm])

  function go(params: { page?: number; limit?: number }) {
    const p = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value == null) p.delete(key)
      else p.set(key, String(value))
    })
    navigate(`?${p.toString()}`)
  }

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Input
          type="email"
          placeholder="Filter by email"
          value={term}
          onChange={e => setTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div>
        {(isLoading || isSubmitting) && <LoadingState />}

        <div className="overflow-auto border rounded mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'outline'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center space-x-2">
                      <fetcher.Form method="post">
                        <input type="hidden" name="action" value="toggleActive" />
                        <input type="hidden" name="userId" value={user._id} />
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 px-2 h-[24px]"
                          disabled={isSubmitting}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </fetcher.Form>
                      <fetcher.Form method="post">
                        <input type="hidden" name="action" value="toggleRole" />
                        <input type="hidden" name="userId" value={user._id} />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs py-1 px-2 h-[24px]"
                          disabled={isSubmitting}
                        >
                          Make {user.role === 'customer' ? 'Admin' : 'Customer'}
                        </Button>
                      </fetcher.Form>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    {' '}
                    <EmptyState />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-4 mt-4">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => go({ page: page - 1 })}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button size="sm" variant={'ghost'} className="text-muted-foreground">
              {page} of {totalPages}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => go({ page: page + 1 })}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>

          <Select
            defaultValue={String(limit)}
            onValueChange={value => go({ limit: Number(value), page: 1 })}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="18">18</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
