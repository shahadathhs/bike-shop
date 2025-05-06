import { useEffect, useState } from 'react'
import { useLocation, useNavigation } from 'react-router'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { DashboardSidebar } from './DashboardSideBar'
import { DashboardNavbar } from './DashboardNavBar'
import { Outlet } from 'react-router'
import Loading from '../Loading'

export function DashboardLayout({ userRole = 'customer' }: { userRole?: 'admin' | 'customer' }) {
  const location = useLocation()
  const pathname = location.pathname

  const navigation = useNavigation()

  const [currentPath, setCurrentPath] = useState<string>('')

  useEffect(() => {
    // Extract the current path for display in the navbar
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathname.startsWith('/admin/update-product/')) {
      setCurrentPath('Update Product')
    } else if (pathSegments.length > 1) {
      // Capitalize the last segment for display
      const lastSegment = pathSegments[pathSegments.length - 1]
      setCurrentPath(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1))
    } else {
      setCurrentPath('Dashboard')
    }
  }, [pathname])

  // * Check if we are doing an "internal" transition (only search changes) or moving to a new route.
  const isInternalTransition = navigation.location?.pathname === location.pathname

  // * Show spinner only if we’re navigating (state === 'loading') and moving to a different route.
  const showSpinner = navigation.state === 'loading' && !isInternalTransition

  // * Scroll to top when loading starts
  useEffect(() => {
    if (showSpinner) {
      if (window !== undefined) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [showSpinner])

  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />
      <div className="min-h-screen bg-background w-full">
        <SidebarInset>
          <DashboardNavbar currentPath={currentPath} userRole={userRole} />
          <main className="w-full p-2">
            {showSpinner ? <Loading className="h-[calc(100vh-88px)]" /> : <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
