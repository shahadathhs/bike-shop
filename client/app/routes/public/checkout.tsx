import type React from 'react'

import { useEffect, useState } from 'react'
import { redirect, useLoaderData, useNavigate, type LoaderFunction } from 'react-router'
import { getCookie } from '~/services/auth.services'
import type { TBike } from '~/types/product'
import type { TCookie } from '~/types/user'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { CheckCircle2, CreditCard, Lock, ShieldCheck, AlertCircle } from 'lucide-react'

export function meta() {
  return [{ title: 'Bike Store - Checkout' }, { name: 'description', content: 'Checkout page' }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  return { cookie }
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export default function CheckoutPage() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()

  const [cartItems, setCartItems] = useState<TBike[]>([])

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
  const customer = {
    name: cookie.name,
    email: cookie.email,
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-2">Complete your purchase securely</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-8">
        {/* Order Summary - 2 columns */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden border bg-muted/20 flex-shrink-0">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Quantity: 1</p>
                  </div>
                  <div className="font-semibold">${Number(item.price).toFixed(2)}</div>
                </div>
              ))}

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(total + total * 0.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 flex-col items-start space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Your data is protected</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Payment Form - 3 columns */}
        <div className="md:col-span-3">
          <Elements stripe={stripePromise}>
            <PaymentForm
              total={total + total * 0.1}
              cartItems={cartItems}
              customer={customer}
              cookie={cookie}
              onRemoveItem={handleRemove}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}

interface PaymentFormProps {
  total: number
  cartItems: TBike[]
  customer: { name: string; email: string }
  cookie: TCookie
  onRemoveItem: (id: string) => void
}

function PaymentForm({ total, cartItems, customer, cookie, onRemoveItem }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>(
    'idle',
  )

  // Create a order for each bike of the cart in db
  const createOrderForEachBike = async (bike: TBike) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookie.token}`,
        },
        body: JSON.stringify({
          product: bike._id,
          email: cookie.email,
          totalPrice: bike.price,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()
      if (data.success) {
        onRemoveItem(bike._id)
      }
      return data
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return
    }

    if (error) {
      elements.getElement('card')?.focus()
      return
    }

    if (cardComplete) {
      setProcessing(true)
      setPaymentStatus('processing')
    }

    // Simulate payment processing
    try {
      // In a real implementation, you would create a payment intent on your server
      // and confirm it here. Since we're doing client-side only, we'll simulate it.

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Get the card element
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Simulate a successful payment
      // In a real implementation, you would use stripe.confirmCardPayment here

      // Process orders after successful payment
      setPaymentStatus('success')

      // Create orders for each bike
      for (const bike of cartItems) {
        await createOrderForEachBike(bike)
      }

      // Clear cart after successful payment and order creation
      localStorage.setItem('cart', '[]')

      // Wait a moment before redirecting to allow user to see success message
      setTimeout(() => {
        navigate('/order-success')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setPaymentStatus('error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>Enter your card information to complete your purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  disabled
                  value={customer.name}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={customer.email}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="card" className="block text-sm font-medium mb-1">
                Card Information
              </label>
              <div className="border rounded-md p-3 focus-within:ring-2 focus-within:ring-primary">
                <CardElement
                  id="card"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  onChange={e => {
                    setError(e.error ? e.error.message : null)
                    setCardComplete(e.complete)
                  }}
                />
              </div>
              {error && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {paymentStatus === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">Payment Successful!</h3>
                <p className="text-green-700 text-sm">Your order has been placed successfully.</p>
              </div>
            </div>
          ) : (
            <Button
              type="submit"
              className="w-full py-6 text-lg font-medium"
              disabled={!stripe || processing || !cardComplete}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
