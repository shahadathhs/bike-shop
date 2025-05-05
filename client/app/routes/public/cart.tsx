import { type LoaderFunction, useLoaderData, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { Card, CardTitle, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { getCookie } from '~/services/auth.services'
import type { TBike } from '~/types/product'

// Server-side auth loader
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) {
    return { isLogin: false, cookie: null }
  }

  return { isLogin: true, cookie }
}

export default function CartPage() {
  const { isLogin } = useLoaderData() as { isLogin: boolean }
  const [cartItems, setCartItems] = useState<TBike[]>([])
  const navigate = useNavigate()

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(stored)
    }
  }, [])

  const handleRemove = (id: string) => {
    const updated = cartItems.filter(item => item._id !== id)
    setCartItems(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0)

  const handleCheckout = () => {
    if (!isLogin) {
      // redirect to login
      navigate('/login')
    } else {
      // proceed to checkout flow
      navigate('/checkout')
    }
  }

  return (
    <div className="my-10">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold">Your Shopping Cart</h1>
        <p className="mt-2 text-lg text-gray-600">Review your selected bikes before checkout.</p>
      </header>
      <div>
        {cartItems.length === 0 ? (
          <Card className="p-6 text-center">
            <CardTitle>Your cart is empty</CardTitle>
            <CardContent>Add some bikes to your cart to get started.</CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/product')}>Browse Bikes</Button>
            </CardFooter>
          </Card>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bike</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map(item => (
                  <TableRow key={item._id}>
                    <TableCell className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span>{item.name}</span>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <CardFooter className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total: ${total.toFixed(2)}</span>
              <Button onClick={handleCheckout}>
                {isLogin ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>
            </CardFooter>
          </div>
        )}
      </div>
    </div>
  )
}
