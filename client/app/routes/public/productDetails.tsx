import { Link, redirect, useLoaderData, type LoaderFunction, type MetaFunction } from 'react-router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import type { TBike } from '~/types/product'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const meta: MetaFunction = ({ data }: { data: any }) => {
  if (!data?.product) {
    return [
      { title: 'Bike Store - Product Not Found' },
      { name: 'description', content: 'Product not found in Bike Store' },
    ]
  }
  const { product } = data
  return [
    { title: `Bike Store - ${product.name}` },
    { name: 'description', content: product.description },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const productId = url.pathname.split('/')[2]
  if (!productId) return redirect('/products')

  try {
    // Fetch main product
    const prodRes = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${productId}`)
    if (!prodRes.ok) return redirect('/products')
    const prodData = await prodRes.json()
    const product: TBike = prodData.data

    // Fetch related products by same category (limit 4)
    const relatedRes = await fetch(
      `${import.meta.env.VITE_API_URL}/bikes?category=${product.category}&limit=5`,
    )
    const relatedData = await relatedRes.json()
    // exclude current product and take 4
    const related: TBike[] = relatedData.data.bikes
      .filter((b: TBike) => b._id !== product._id)
      .slice(0, 4)

    return { product, related }
  } catch (error) {
    console.error('Error in loader:', error)
    return { product: null, related: [] }
  }
}

export default function ProductDetailsPage() {
  const { product, related } = useLoaderData<{ product: TBike | null; related: TBike[] }>()
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    if (!product?._id) return
    const cart =
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : []
    const exists = cart.some((item: TBike) => item._id === product._id)
    setInCart(exists)
  }, [product?._id])

  const handleCartToggle = () => {
    if (!product) return

    const cart =
      typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : []

    let updatedCart
    if (inCart) {
      // remove
      updatedCart = cart.filter((item: TBike) => item._id !== product._id)
    } else {
      // add
      updatedCart = [...cart, product]
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setInCart(!inCart)
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-600">
          Please go back to the{' '}
          <Link to="/products" className="text-blue-600 underline">
            products page
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto my-10 space-y-12">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold">{product.name}</h1>
        <p className="text-gray-600">
          {product.category} • {product.brand}
        </p>
      </header>

      <Card className="flex flex-col md:flex-row gap-4 items-center border rounded shadow dark:bg-black/5">
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

          <Button
            className="hover:shadow hover:cursor-pointer"
            onClick={handleCartToggle}
            variant={inCart ? 'destructive' : 'default'}
          >
            {inCart ? 'Remove from Cart' : 'Add to Cart'}
          </Button>

          {/* if in cart then show button to go to cart */}
          {inCart && (
            <Link to="/cart">
              <Button className="hover:shadow hover:cursor-pointer ml-4" variant="default">
                Go to Cart
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Related Products */}
      {related?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(r => (
              <div
                key={r._id}
                className=" rounded border flex flex-col overflow-hidden hover:shadow transition-shadow"
              >
                <div className="h-40 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold mb-2">{r.name}</h3>
                  <p className="text-sm flex-1 text-gray-600">${r.price}</p>
                  <Link to={`/product/${r._id}`} className="mt-4 inline-block">
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
