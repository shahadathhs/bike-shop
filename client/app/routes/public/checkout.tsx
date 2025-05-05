import { useEffect, useState } from 'react'
import { redirect, useLoaderData, useNavigate, type LoaderFunction } from 'react-router'
import { getCookie } from '~/services/auth.services'
import type { TBike } from '~/types/product'
import type { TCookie } from '~/types/user'

export function meta() {
  return [{ title: 'Bike Store - Checkout' }, { name: 'description', content: 'Checkout page' }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  return { cookie }
}

export default function CheckoutPage() {
  const navigate = useNavigate()
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

  // * create a order for each bike of the cart in db
  const createOrderForEachBike = async (bike: TBike) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.token}`,
      },
      body: JSON.stringify({
        bike,
        email: cookie.email,
        totalPrice: bike.price,
        quantity: 1,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create order')
    }

    const data = await response.json()
    console.log('data', data)
    if (data.success) {
      handleRemove(bike._id)
    }
    return data
  }

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0)
  const quantity = cartItems.length
  const customer = {
    name: cookie.name,
    email: cookie.email,
  }
  console.log('Payment Data', { total, quantity, customer })

  return <div>CheckoutPage</div>
}
