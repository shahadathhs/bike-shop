import { useEffect } from 'react'
import { redirect, useLoaderData } from 'react-router'
import { DashboardLayout } from '~/components/shared/dashboard/DashboardLayout'
import { useAuth } from '~/context/AuthContext'
import { authServices } from '~/services/auth.services'
import type { TCookie } from '~/types/user'

export const loader = async ({ request }: { request: Request }) => {
  // * This ensures only authenticated users can access the dashboard
  await authServices.requireUserSession(request)

  const url = new URL(request.url)
  const pathname = url.pathname

  // * redirect to analytics page if the user is on the dashboard route
  if (pathname === 'admin') return redirect('admin/profile')

  const cookie = await authServices.getCookie(request)

  return { cookie }
}

export default function DashboardAdminLayout() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()

  const { setCookieToContext } = useAuth()

  // * Set cookie to context when cookie data changes
  useEffect(() => {
    if (cookie) {
      setCookieToContext(cookie) // * don't set cookie to context if it's null
    }
  }, [cookie, setCookieToContext])

  return <DashboardLayout userRole="admin" />
}
