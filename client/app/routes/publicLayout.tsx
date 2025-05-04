import Footer from '~/components/shared/Footer'
import NavBar from '~/components/shared/NavBar'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Loading from '~/components/shared/Loading'

export default function PublicLayout() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return <Loading />

  return (
    <main className="container mx-auto px-2 md:px-0">
      <div className="sticky top-2 left-0 right-0 z-10 container mx-auto px-2 md:px-0">
        <NavBar />
      </div>
      <div className="min-h-screen mb-10">
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}
