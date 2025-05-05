import Footer from '~/components/shared/Footer'
import NavBar from '~/components/shared/NavBar'
import { useEffect, useState } from 'react'
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
  type LoaderFunction,
} from 'react-router'
import Loading from '~/components/shared/Loading'
import { authServices } from '~/services/auth.services'
import type { TCookie } from '~/types/user'
import { useAuth } from '~/context/AuthContext'

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await authServices.getCookie(request)

  return { cookie: cookie ? cookie : null }
}

export default function PublicLayout() {
  // * cookie set in loader
  const { cookie } = useLoaderData<{ cookie: TCookie }>()

  const { setCookieToContext } = useAuth()

  // * Set cookie to context when cookie data changes
  useEffect(() => {
    if (cookie) {
      setCookieToContext(cookie) // * don't set cookie to context if it's null
    }
  }, [cookie, setCookieToContext])

  // * client side rendering
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // * Get the current navigation state
  const navigation = useNavigation()
  const location = useLocation()

  // Check if we are doing an "internal" transition (only search changes) or moving to a new route.
  const isInternalTransition = navigation.location?.pathname === location.pathname

  // Show spinner only if we’re navigating (state === 'loading') and moving to a different route.
  const showSpinner = navigation.state === 'loading' && !isInternalTransition

  // Scroll to top when loading starts
  useEffect(() => {
    if (showSpinner) {
      if (window !== undefined) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [showSpinner])

  // * show a loading indicator while the app is initializing
  if (!isClient) return <Loading className="h-screen" />

  return (
    <main className="container mx-auto px-3 md:px-0">
      <div className="sticky top-2 left-0 right-0 z-10 container mx-auto">
        <NavBar />
      </div>
      <div className="min-h-[400px] mb-10">
        {
          // * Show spinner only if we’re navigating (state === 'loading') and moving to a different route.
          showSpinner ? <Loading className="h-screen" /> : <Outlet />
        }
      </div>
      <Footer />
    </main>
  )
}
