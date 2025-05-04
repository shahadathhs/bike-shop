import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useFetcher, useLoaderData, type ClientActionFunctionArgs } from 'react-router'
import { brands, categories, models } from '~/utils/bikeUtils'
import { useDebounce } from '~/utils/debounce'
import { getToken } from '~/utils/getToken'

export const clientLoader = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes`)

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        products: data,
      }
    } else {
      throw new Error('Failed to fetch products')
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    return {
      error: 'Failed to fetch products',
      products: [],
      errorDetails: err,
    }
  }
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData()
  const action = formData.get('action')

  const token = getToken()

  if (action === 'delete') {
    const productId = formData.get('id')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        return {
          success: true,
          message: 'Product deleted successfully',
        }
      } else {
        const errorData = await response.json()
        return {
          error: errorData.message || 'Failed to delete product',
          errorDetails: errorData,
        }
      }
    } catch (err: any) {
      console.error('Error deleting product:', err)
      return {
        error: err.message || 'Failed to delete product',
        errorDetails: err,
      }
    }
  }

  if (action === 'restock') {
    const productId = formData.get('id')
    const newQuantity = formData.get('quantity')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${productId}/restock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        return {
          success: true,
          message: 'Product restocked successfully',
        }
      } else {
        const errorData = await response.json()
        return {
          error: errorData.message || 'Failed to restock product',
          errorDetails: errorData,
        }
      }
    } catch (err: any) {
      console.error('Error restocking product:', err)
      return {
        error: err.message || 'Failed to restock product',
        errorDetails: err,
      }
    }
  }
}

export default function Products() {
  const loaderData = useLoaderData()
  const [products, setProducts] = useState(loaderData.products.data.bikes)

  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  // State for products and metadata (for pagination)
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Local state for the input value
  const [inputValue, setInputValue] = useState('')
  // Actual search term that drives data fetching
  const [searchTerm, setSearchTerm] = useState('')

  // Debounce the input value with a delay of 100ms
  const debouncedInput = useDebounce(inputValue, 100)

  // Update the actual search term whenever the debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedInput)
    setPage(1) // Reset to first page whenever search changes
  }, [debouncedInput])

  // Query/filter state variables
  const [priceRange, setPriceRange] = useState('all') // Options: "all", "under300", "300to500", "500to800", "above800"
  const [model, setModel] = useState('all') // "all" or specific values like "Sport", etc.
  const [category, setCategory] = useState('all') // "all", "Mountain", "Road", etc.
  const [brand, setBrand] = useState('all') // "all", "Trek", "Cannondale", etc.
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const token = getToken()

  // Helper to convert priceRange value to min and max values.
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

  // Fetch products function: constructs query parameters from state.
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

  // Fetch products when any filter or pagination state changes
  useEffect(() => {
    fetchProducts()
  }, [searchTerm, priceRange, model, category, brand, page, limit])

  // Pagination controls
  const handlePrevPage = () => {
    if (page > 1) setPage((prev: any) => prev - 1)
  }

  const handleNextPage = () => {
    if (metadata.total > page * limit) setPage((prev: any) => prev + 1)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="mb-4">
        <Link to="/dashboard/admin/create-product" className="btn btn-primary">
          Create New Product
        </Link>
      </div>

      {/* Filter Form */}
      <div className="mb-6 flex flex-col lg:flex-row lg:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name, brand, or category..."
          value={searchTerm}
          onChange={e => setInputValue(e.target.value)}
          className="input input-bordered w-full md:max-w-lg lg:flex-1"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Price Range filter */}
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
            {models.map(model => (
              <option key={model.value} value={model.value}>
                {model.label}
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
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
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
            {brands.map(brand => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* loading state */}
      {fetcher.state === 'submitting' ||
        (loading && (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ))}

      {/* Table */}
      {fetcher.state !== 'submitting' && !loading && error === '' && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className=" w-full table table-zebra">
            {products?.length > 0 ? (
              <>
                <thead className="text-center">
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {products?.map((product: any) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.modelName}</td>
                      <td>{product.category}</td>
                      <td>${product.price}</td>
                      <td>{product.quantity}</td>
                      <td className="space-x-2 flex items-center gap-2 justify-center">
                        {/* Edit button */}
                        <Link
                          to={`/dashboard/admin/update-product/${product._id}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                        {/* restock form */}
                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() =>
                            (
                              document.getElementById('restock-modal') as HTMLDialogElement
                            )?.showModal()
                          }
                        >
                          Restock
                        </button>

                        {/* Restock Modal */}
                        <dialog id="restock-modal" className="modal">
                          <div className="modal-box">
                            <fetcher.Form method="post" className="flex flex-col gap-4">
                              <input type="hidden" name="action" value="restock" />
                              <input type="hidden" name="id" value={product._id} />
                              <div className="text-left">
                                <label className="label mb-2">Quantity to restock:</label>
                                <input
                                  type="number"
                                  id="quantity"
                                  name="quantity"
                                  defaultValue={product.quantity}
                                  className="input input-bordered w-full"
                                  required
                                />
                              </div>
                              <div>
                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="btn btn-info btn-sm"
                                >
                                  {isSubmitting ? 'Restocking...' : 'Restock'}
                                </button>
                              </div>
                            </fetcher.Form>
                            <div className="modal-action">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                              </form>
                            </div>
                          </div>
                        </dialog>

                        {/* Delete from */}
                        <fetcher.Form method="delete">
                          <input type="hidden" name="action" value="delete" />
                          <input type="hidden" name="id" value={product._id} />
                          <button type="submit" className="btn btn-error btn-sm">
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                          </button>
                        </fetcher.Form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-4 mt-4">
        <button onClick={handlePrevPage} className="btn btn-outline btn-sm" disabled={page === 1}>
          Previous
        </button>
        <span className="text-secondary">
          Page {page} of {Math.ceil(metadata.total / metadata.limit)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(metadata.total / metadata.limit)}
          className="btn btn-outline btn-sm"
        >
          Next
        </button>

        {/* limit dropdown */}
        <div>
          <select
            value={limit}
            onChange={e => {
              setLimit(parseInt(e.target.value))
              setPage(1)
            }}
            className="select select-bordered"
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
