import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { getToken } from '~/utils/getToken'
import { useDebounce } from '~/utils/debounce'
import { brands, categories, models } from '~/utils/bikeUtils'

export function meta() {
  return [{ title: 'Bike Store - Products' }, { name: 'description', content: 'See & buy bikes' }]
}

export default function ALLProductPage() {
  // Local state for products and pagination metadata.
  const [products, setProducts] = useState<
    Array<{
      _id: string
      image: string
      name: string
      description: string
      price: number
    }>
  >([])
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // State for search and filters.
  const [inputValue, setInputValue] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedInput = useDebounce(inputValue, 100)
  const [priceRange, setPriceRange] = useState('all') // Options: "all", "under300", "300to500", "500to800", "above800"
  const [model, setModel] = useState('all') // "all" or specific values like "Sport", etc.
  const [category, setCategory] = useState('all') // "all", "Mountain", "Road", etc.
  const [brand, setBrand] = useState('all') // "all", "Trek", "Cannondale", etc.
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const token = getToken() // For public pages this might be optional

  // Update the actual search term from the debounced input.
  useEffect(() => {
    setSearchTerm(debouncedInput)
    setPage(1) // Reset to first page on search change.
  }, [debouncedInput])

  // Helper function to map price range options to numeric values.
  const getPriceRangeValues = (range: string) => {
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

  // Fetch products from the backend based on search, filters, and pagination.
  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const { minPrice, maxPrice } = getPriceRangeValues(priceRange)
      const params = new URLSearchParams()
      if (searchTerm) params.append('searchTerm', searchTerm)
      if (minPrice !== undefined) params.append('minPrice', String(minPrice))
      if (maxPrice !== undefined) params.append('maxPrice', String(maxPrice))
      if (model !== 'all') params.append('model', model)
      if (category !== 'all') params.append('category', category)
      if (brand !== 'all') params.append('brand', brand)
      params.append('page', String(page))
      params.append('limit', String(limit))

      const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.data.bikes)
        setMetadata(data.data.metadata)
      } else {
        const errorData = await response.json()
        setError(errorData.data.error || 'Failed to fetch products')
        toast.error(errorData.data.error || 'Failed to fetch products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Error fetching products')
      toast.error('Error fetching products')
    }
    setLoading(false)
  }

  // Refetch products when any of the filter or pagination states change.
  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, priceRange, model, category, brand, page, limit])

  // Pagination controls
  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1)
  }

  const handleNextPage = () => {
    if (metadata.total > page * limit) setPage(prev => prev + 1)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )
    }

    if (error) {
      return <p className="text-red-500">{error}</p>
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product._id} className="card bg-base-100 shadow-lg">
                <figure>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover h-48 w-full"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{product.name}</h2>
                  <p>{product.description.substring(0, 100)}...</p>
                  <p className="text-lg font-semibold">
                    {' '}
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <div className="card-actions justify-end">
                    <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full">No products found.</p>
          )}
        </div>

        <div className="flex justify-end items-center space-x-4 mt-4">
          <button onClick={handlePrevPage} className="btn btn-outline btn-sm" disabled={page === 1}>
            Previous
          </button>
          <span className="text-primary font-medium">
            Page {page} of {Math.ceil(metadata.total / metadata.limit)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === Math.ceil(metadata.total / metadata.limit)}
            className="btn btn-outline btn-sm"
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
      </>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, brand, or category..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="input input-bordered w-full lg:max-w-lg lg:flex-1"
        />

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={e => {
              setPriceRange(e.target.value)
              setPage(1)
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Prices</option>
            <option value="under300">Under $300</option>
            <option value="300to500">$300 - $500</option>
            <option value="500to800">$500 - $800</option>
            <option value="above800">Above $800</option>
          </select>

          {/* Model Filter */}
          <select
            value={model}
            onChange={e => {
              setModel(e.target.value)
              setPage(1)
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Models</option>
            {models.map(m => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={e => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={brand}
            onChange={e => {
              setBrand(e.target.value)
              setPage(1)
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Brands</option>
            {brands.map(b => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {renderContent()}
    </div>
  )
}
