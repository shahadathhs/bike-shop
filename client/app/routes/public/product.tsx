import { brands, categories, models } from '~/utils/bikeUtils'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
  type LoaderFunction,
} from 'react-router'
import { useEffect, useState } from 'react'
import { useDebounce } from '~/utils/debounce'
import NoProductsFound from '~/components/shared/NoProductsFound'

export const meta = () => [
  { title: 'Bike Store - Products' },
  { name: 'description', content: 'See & buy bikes' },
]

export type LoaderData = {
  bikes: Array<{ _id: string; image: string; name: string; description: string; price: number }>
  metadata: { total: number; page: number; limit: number }
  filters: {
    searchTerm: string
    priceRange: string
    model: string
    category: string
    brand: string
    page: number
    limit: number
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const searchTerm = url.searchParams.get('searchTerm') || ''
  const priceRange = url.searchParams.get('priceRange') || 'all'
  const model = url.searchParams.get('model') || 'all'
  const category = url.searchParams.get('category') || 'all'
  const brand = url.searchParams.get('brand') || 'all'
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const limit = parseInt(url.searchParams.get('limit') || '10', 10)

  const getPriceValues = (range: string) => {
    switch (range) {
      case 'under300':
        return { minPrice: undefined, maxPrice: 300 }
      case '300to500':
        return { minPrice: 300, maxPrice: 500 }
      case '500to800':
        return { minPrice: 500, maxPrice: 800 }
      case 'above800':
        return { minPrice: 800, maxPrice: undefined }
      default:
        return { minPrice: undefined, maxPrice: undefined }
    }
  }

  const { minPrice, maxPrice } = getPriceValues(priceRange)
  const params = new URLSearchParams()
  if (searchTerm) params.append('searchTerm', searchTerm)
  if (minPrice !== undefined) params.append('minPrice', String(minPrice))
  if (maxPrice !== undefined) params.append('maxPrice', String(maxPrice))
  if (model !== 'all') params.append('model', model)
  if (category !== 'all') params.append('category', category)
  if (brand !== 'all') params.append('brand', brand)
  params.append('page', String(page))
  params.append('limit', String(limit))

  const res = await fetch(`${import.meta.env.VITE_API_URL}/bikes?${params.toString()}`)

  if (!res.ok) {
    throw new Response('Failed to fetch products', { status: res.status })
  }

  const data = await res.json()

  return {
    bikes: data.data.bikes,
    metadata: data.data.metadata,
    filters: { searchTerm, priceRange, model, category, brand, page, limit },
  }
}

export default function ALLProductPage() {
  const { bikes, metadata, filters } = useLoaderData<LoaderData>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  // Local state for debounced search
  const [inputValue, setInputValue] = useState(filters.searchTerm)
  const debouncedSearch = useDebounce(inputValue, 300)

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set('searchTerm', debouncedSearch)
    // reset to first page on search
    params.set('page', '1')
    setSearchParams(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  // Helper to update a single param (resets page to 1 unless updating page)
  const updateParam = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    if (resetPage && key !== 'page') {
      params.set('page', '1')
    }
    setSearchParams(params)
  }

  return (
    <div className="py-4">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <p className="mb-6 text-xl max-w-lg">
        Explore our extensive selection of bikes, from classic to modern, and find the perfect fit
        for your needs.
      </p>

      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
        <Input
          placeholder="Search by name, brand, or category..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="flex-1"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={filters.priceRange} onValueChange={v => updateParam('priceRange', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under300">Under $300</SelectItem>
              <SelectItem value="300to500">$300 - $500</SelectItem>
              <SelectItem value="500to800">$500 - $800</SelectItem>
              <SelectItem value="above800">Above $800</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.model} onValueChange={v => updateParam('model', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Models" />
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

          <Select value={filters.category} onValueChange={v => updateParam('category', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
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

          <Select value={filters.brand} onValueChange={v => updateParam('brand', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
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

      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : bikes.length === 0 ? (
        <NoProductsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bikes.map(product => (
            <div
              key={product._id}
              className=" rounded-2xl shadow-md flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="overflow-hidden rounded-t-2xl">
                <img src={product.image} alt={product.name} className="object-cover h-48 w-full" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-sm flex-1">{product.description.substring(0, 100)}...</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-lg">${product.price}</span>
                  <Link to={`/product/${product._id}`}>
                    <Button size="sm">Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end items-center space-x-4 mt-6">
        <Button
          variant="outline"
          disabled={filters.page <= 1}
          onClick={() => updateParam('page', String(filters.page - 1), false)}
        >
          Previous
        </Button>

        <span>
          Page {filters.page} of {Math.ceil(metadata.total / metadata.limit)}
        </span>

        <Button
          variant="outline"
          disabled={filters.page >= Math.ceil(metadata.total / metadata.limit)}
          onClick={() => updateParam('page', String(filters.page + 1), false)}
        >
          Next
        </Button>

        <Select value={String(filters.limit)} onValueChange={v => updateParam('limit', v)}>
          <SelectTrigger>
            <SelectValue placeholder="10 per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
