import { useEffect } from 'react'
import { redirect, useLoaderData, type LoaderFunction } from 'react-router'
import { DashboardLayout } from '~/components/shared/dashboard/DashboardLayout'
import { useAuth } from '~/context/AuthContext'
import { authServices } from '~/services/auth.services'
import type { TCookie } from '~/types/user'

export const loader: LoaderFunction = async ({ request }) => {
  // * This ensures only authenticated users can access the dashboard
  await authServices.requireUserSession(request)

  const url = new URL(request.url)
  const pathname = url.pathname

  if (pathname === '/customer') return redirect('/customer/profile')

  const cookie = await authServices.getCookie(request)

  return { cookie }
}

export default function DashboardCustomerLayout() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()

  const { setCookieToContext } = useAuth()

  // * Set cookie to context when cookie data changes
  useEffect(() => {
    if (cookie) {
      setCookieToContext(cookie) // * don't set cookie to context if it's null
    }
  }, [cookie, setCookieToContext])

  return <DashboardLayout userRole="customer" />
}
