import { redirect } from 'react-router'
import { authServices } from '~/services/auth.services'

export const loader = async ({ request }: { request: Request }) => {
  // * This ensures only authenticated users can access the dashboard
  await authServices.requireUserSession(request)

  const url = new URL(request.url)
  const pathname = url.pathname

  // * redirect to analytics page if the user is on the dashboard route
  if (pathname === '/dashboard') {
    return redirect('/')
  }

  return null
}
