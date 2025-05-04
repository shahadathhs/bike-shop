import { LogOut, User } from 'lucide-react'
import { Link, useFetcher } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { useAuth } from '~/context/AuthContext'
import { ModeToggle } from '../ModeToggle'

interface DashboardNavbarProps {
  currentPath: string
  userRole?: 'admin' | 'customer'
}

export function DashboardNavbar({ currentPath, userRole = 'customer' }: DashboardNavbarProps) {
  const { logout } = useAuth()

  const fetcher = useFetcher()

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    logout()
    fetcher.submit(null, { method: 'post', action: '/api/logout' })
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User avatar" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/${userRole}/profile`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/${userRole}/setting`}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
