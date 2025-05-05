import { redirect, useLoaderData, type LoaderFunction, type MetaFunction } from 'react-router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const meta: MetaFunction = ({ data }: { data: any }) => {
  if (!data?.data) {
    return [
      { title: 'Bike Store - Product Not Found' },
      { name: 'description', content: 'Product not found in Bike Store' },
    ]
  }

  const product = data.data
  return [
    { title: `Bike Store - ${product.name}` },
    { name: 'description', content: product.description },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const productId = segments[2] // /product/:id

  if (!productId) return redirect('/product')

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${productId}`)

    if (!response.ok) return redirect('/product')

    const productData = await response.json()
    return productData
  } catch (error) {
    console.error('Error fetching product:', error)
    return { data: null, error: 'Failed to fetch product' }
  }
}

export default function ProductDetailsPage() {
  const loaderData = useLoaderData()
  const product = loaderData.data
  const [added, setAdded] = useState(false)

  useEffect(() => {
    // Reset added state when product changes
    setAdded(false)
  }, [product?.id])

  const handleAddToCart = () => {
    if (!product) return

    const current =
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : []

    const updated = [...current, product]
    localStorage.setItem('cart', JSON.stringify(updated))
    setAdded(true)
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-600">Please go back to the products page.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto my-10">
      {/* Page Heading */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold">Bike Store - Product Details</h1>
        <p className="mt-2 text-lg text-gray-600">
          Discover more about this bike and add it to your cart.
        </p>
      </header>

      <Card className="flex flex-col md:flex-row gap-4 items-center">
        {/* Image Section */}
        <CardContent className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[350px] object-cover rounded"
          />
        </CardContent>

        {/* Details Section */}
        <CardContent className="md:w-1/2 md:border-l">
          <CardTitle className="text-3xl">{product.name}</CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            {product.category} by {product.brand}
          </CardDescription>
          <div className="space-y-2 mb-4">
            <p>
              <span className="font-semibold">Model:</span> {product.modelName}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ${product.price}
            </p>
            <p>
              <span className="font-semibold">Quantity Available:</span> {product.quantity}
            </p>
          </div>
          <p className="mb-6 text-gray-700">{product.description}</p>

          <Button onClick={handleAddToCart} disabled={added}>
            {added ? 'Added to Cart' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
