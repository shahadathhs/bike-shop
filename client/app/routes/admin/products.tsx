import { getCookie } from '~/services/auth.services'
import type { TCookie } from '~/types/user'

import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useFetcher,
  redirect,
  type LoaderFunction,
  type ActionFunction,
  Link,
} from 'react-router'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '~/components/ui/table'
import { Label } from '~/components/ui/label'
import { brands, categories, models } from '~/utils/bikeUtils'
import { useDebounce } from '~/utils/debounce'
import { getPriceRangeValues } from '~/utils/getPriceRangeValues'
import { ArrowBigLeft, ArrowBigRight, ArrowRight } from 'lucide-react'

// Types
interface Product {
  _id: string
  name: string
  brand: string
  modelName: string
  category: string
  price: number
  quantity: number
}

interface ProductsResponse {
  data: {
    bikes: Product[]
    metadata: { total: number; page: number; limit: number }
  }
}

interface LoaderData {
  products: Product[]
  metadata: { total: number; page: number; limit: number }
  cookie: TCookie
}

// Loader: fetch bikes based on query params
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)
  if (!cookie.token) return redirect('/login')

  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') ?? '1')
  const limit = Number(url.searchParams.get('limit') ?? '7')
  const searchTerm = url.searchParams.get('searchTerm') ?? ''
  const modelFilter = url.searchParams.get('model') ?? ''
  const categoryFilter = url.searchParams.get('category') ?? ''
  const brandFilter = url.searchParams.get('brand') ?? ''
  const priceRange = url.searchParams.get('priceRange') ?? ''

  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (searchTerm) params.set('searchTerm', searchTerm)
  if (modelFilter) params.set('model', modelFilter)
  if (categoryFilter) params.set('category', categoryFilter)
  if (brandFilter) params.set('brand', brandFilter)
  const { minPrice, maxPrice } = getPriceRangeValues(priceRange)
  if (minPrice != null) params.set('minPrice', String(minPrice))
  if (maxPrice != null) params.set('maxPrice', String(maxPrice))

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/bikes?${params.toString()}`, {
      headers: { Authorization: `Bearer ${cookie.token}` },
    })
    if (!res.ok) throw new Error('Failed to fetch products')
    const json: ProductsResponse = await res.json()
    return {
      products: json.data.bikes,
      metadata: json.data.metadata,
      cookie,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error fetching products:', err)
    return {
      products: [],
      metadata: { total: 0, page, limit },
      cookie,
    }
  }
}

// Action: delete or restock
export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCookie(request)
  if (!cookie.token) return redirect('/login')

  const formData = await request.formData()
  const actionType = formData.get('action')
  const id = formData.get('id')

  if (actionType === 'delete') {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${cookie.token}` },
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to delete product')
    }
  }

  if (actionType === 'restock') {
    const quantity = formData.get('quantity')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${id}/restock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.token}`,
      },
      body: JSON.stringify({ quantity }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to restock product')
    }
  }

  return null
}

export default function Products() {
  const { products, metadata } = useLoaderData<LoaderData>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const fetcher = useFetcher()

  const page = metadata.page
  const limit = metadata.limit
  const total = metadata.total
  const totalPages = Math.ceil(total / limit)

  // Extract current filters from URL
  const currentModel = searchParams.get('model') ?? ''
  const currentCategory = searchParams.get('category') ?? ''
  const currentBrand = searchParams.get('brand') ?? ''
  const currentPriceRange = searchParams.get('priceRange') ?? ''

  const isSubmitting = fetcher.state === 'submitting'

  // Helper to update URL params
  function go(params: {
    page?: number
    limit?: number
    searchTerm?: string
    model?: string
    category?: string
    brand?: string
    priceRange?: string
  }) {
    const p = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      if (value == null || value === '' || value === 'all') p.delete(key)
      else p.set(key, String(value))
    })
    navigate(`?${p.toString()}`)
  }

  const [term, setTerm] = useState(searchParams.get('searchTerm') ?? '')
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
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <Button asChild variant="outline">
          <Link to="/admin/create-product">
            Create Product <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Input
          placeholder="Search by name..."
          value={term}
          onChange={e => setTerm(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 lg:justify-between">
          {/* price range */}
          <Select value={currentPriceRange} onValueChange={v => go({ priceRange: v, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under300">Under $300</SelectItem>
              <SelectItem value="300to500">$300 - $500</SelectItem>
              <SelectItem value="500to800">$500 - $800</SelectItem>
              <SelectItem value="above800">Above $800</SelectItem>
            </SelectContent>
          </Select>

          {/* model */}
          <Select value={currentModel} onValueChange={v => go({ model: v, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {models.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* category */}
          <Select value={currentCategory} onValueChange={v => go({ category: v, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* brand */}
          <Select value={currentBrand} onValueChange={v => go({ brand: v, page: 1 })}>
            <SelectTrigger>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(b => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.modelName}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {/* update */}
                    <Button
                      size="sm"
                      className="px-2 py-1 h-[24px] rounded"
                      variant="outline"
                      asChild
                    >
                      <Link to={`/admin/update-product/${product._id}`}>Edit</Link>
                    </Button>

                    {/* restock */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="px-2 py-1 h-[24px] rounded">
                          Restock
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restock Product</DialogTitle>
                          <DialogDescription>Enter new quantity</DialogDescription>
                        </DialogHeader>
                        <fetcher.Form method="post" className="space-y-4">
                          <input type="hidden" name="action" value="restock" />
                          <input type="hidden" name="id" value={product._id} />
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              disabled
                              defaultValue={product.name}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              name="quantity"
                              type="number"
                              defaultValue={product.quantity}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                              Restock
                            </Button>
                          </DialogFooter>
                        </fetcher.Form>
                      </DialogContent>
                    </Dialog>

                    {/* delete */}
                    <fetcher.Form method="post" key={product._id}>
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="id" value={product._id} />
                      <Button
                        size="sm"
                        key={product._id}
                        className="px-2 py-1 h-[24px] rounded"
                        variant="destructive"
                        disabled={isSubmitting}
                      >
                        Delete
                      </Button>
                    </fetcher.Form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex justify-end items-center space-x-2 mt-4">
        <Button
          size="sm"
          variant="ghost"
          disabled={page <= 1}
          onClick={() => go({ page: page - 1 })}
        >
          <ArrowBigLeft />
        </Button>
        <span>
          {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="ghost"
          disabled={page >= totalPages}
          onClick={() => go({ page: page + 1 })}
        >
          <ArrowBigRight />
        </Button>
        <Select value={String(limit)} onValueChange={v => go({ limit: Number(v), page: 1 })}>
          <SelectTrigger>
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent align="end">
            {[7, 14, 21].map(n => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
