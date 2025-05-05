import { type LoaderFunction, useLoaderData, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { Card, CardTitle, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { ShoppingCart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react'
import { getCookie } from '~/services/auth.services'
import type { TBike } from '~/types/product'
import { motion } from 'motion/react'
import { BorderBeam } from '~/components/magicui/border-beam'

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
      navigate('/cart/checkout')
    }
  }

  return (
    <div className="relative overflow-hidden border rounded my-10">
      <div className="mx-auto px-4 py-10 max-w-3xl">
        <motion.header
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-extrabold tracking-tight">Your Cart</h1>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            Review your selected bikes before checkout.
          </p>
        </motion.header>

        {cartItems.length === 0 ? (
          <Card className="border-2 border-dashed p-10 text-center bg-muted/30">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="text-2xl mb-3">Your cart is empty</CardTitle>
              <CardContent className="text-muted-foreground mb-6">
                Looks like you haven&apos;t added any bikes to your cart yet.
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button size="lg" onClick={() => navigate('/product')} className="px-8 font-medium">
                  Browse Bikes
                </Button>
              </CardFooter>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto border rounded">
            <Table>
              {/* Table header */}
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50%]">Bike</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {/* table body */}
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden border bg-muted/20 flex-shrink-0">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-muted-foreground text-sm mt-1">Premium Bike</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-lg font-semibold">
                      ${Number(item.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item._id)}
                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* table footer */}
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell className="text-right">
                    <span className="mr-2">Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/product')}
                      className="w-full sm:w-auto"
                    >
                      Continue Shopping
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={handleCheckout}
                      size="sm"
                      className="w-full sm:w-auto group relative overflow-hidden"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isLogin ? 'Proceed to Checkout' : 'Login to Checkout'}
                        <ArrowRight />
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>

      <BorderBeam duration={40} size={300} />
    </div>
  )
}
