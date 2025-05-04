import { useEffect, useState } from 'react'
import { useLocation, useNavigation } from 'react-router'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { DashboardSidebar } from './DashboardSideBar'
import { DashboardNavbar } from './DashboardNavBar'
import { Outlet } from 'react-router'
import Loading from '../Loading'

export function DashboardLayout({ userRole = 'customer' }: { userRole?: 'admin' | 'customer' }) {
  const pathname = useLocation().pathname
  const [currentPath, setCurrentPath] = useState<string>('')

  useEffect(() => {
    // Extract the current path for display in the navbar
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 1) {
      // Capitalize the last segment for display
      const lastSegment = pathSegments[pathSegments.length - 1]
      setCurrentPath(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1))
    } else {
      setCurrentPath('Dashboard')
    }
  }, [pathname])

  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />
      <div className="min-h-screen bg-background w-full">
        <SidebarInset>
          <DashboardNavbar currentPath={currentPath} userRole={userRole} />
          <main className="w-full p-3">
            {isLoading ? <Loading className="h-[calc(100vh-88px)]" /> : <Outlet />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
