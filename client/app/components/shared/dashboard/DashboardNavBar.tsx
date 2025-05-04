import { SidebarTrigger } from '~/components/ui/sidebar'
import { ModeToggle } from '../ModeToggle'
import ProfileDropdown from '../ProfileDropdown'

interface DashboardNavbarProps {
  currentPath: string
  userRole?: 'admin' | 'customer'
}

export function DashboardNavbar({ currentPath, userRole = 'customer' }: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold">{currentPath}</h1>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-muted-foreground">
              {userRole === 'admin' ? 'Admin' : 'Customer'} Dashboard
            </span>
          </div>
          <ProfileDropdown userRole={userRole} />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
