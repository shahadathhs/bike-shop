// CheckoutButton.jsx
import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function CheckoutButton({ orderId, items }: { orderId: string; items: any[] }) {
  const handleCheckout = async () => {
    try {
      // Call your backend to create a checkout session
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, items }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }
      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })
        if (error) {
          toast.error(error?.message || 'Failed to redirect to Stripe')
        }
      } else {
        throw new Error('Stripe failed to load')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed. Please try again.')
    }
  }
  return (
    <button onClick={handleCheckout} className="btn btn-primary">
      Checkout
    </button>
  )
}
