import { redirect, useLoaderData, type LoaderFunction } from 'react-router'
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
  const { cookie } = useLoaderData<{ cookie: TCookie }>()
  console.log('cookie', cookie)

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
    return data
  }
  return <div>CheckoutPage</div>
}
