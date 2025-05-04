import Footer from '~/components/shared/Footer'
import NavBar from '~/components/shared/NavBar'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useNavigation, type LoaderFunction } from 'react-router'
import Loading from '~/components/shared/Loading'
import { authServices } from '~/services/auth.services'
import type { TCookie } from '~/types/user'
import { useAuth } from '~/context/AuthContext'

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await authServices.getCookie(request)

  return { cookie: cookie ? cookie : null }
}

export default function PublicLayout() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()

  const { setCookieToContext } = useAuth()

  // * Set cookie to context when cookie data changes
  useEffect(() => {
    if (cookie) {
      setCookieToContext(cookie) // * don't set cookie to context if it's null
    }
  }, [cookie, setCookieToContext])

  const [isClient, setIsClient] = useState(false)
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  useEffect(() => {
    setIsClient(true)
  }, [])

  //* show a loading indicator while the app is initializing
  if (!isClient || isLoading) return <Loading className="h-screen" />

  return (
    <main className="container mx-auto px-3 md:px-0">
      <div className="sticky top-2 left-0 right-0 z-10 container mx-auto">
        <NavBar />
      </div>
      <div className="min-h-[400px] mb-10">
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}
