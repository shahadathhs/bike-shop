import { useAuth } from '~/provider/auth/AuthContext'
import { Link, NavLink } from 'react-router'
import logoImg from 'assets/logo.png'
import { navLinks } from '~/constant/navigationLinks'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Menu } from 'lucide-react'

function RouterNavLink({
  to,
  children,
  className = '',
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${className} text-sm font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export default function NavBar() {
  const { user, logout } = useAuth()

  return (
    <header className="border bg-background p-4 my-2 rounded shadow-sm">
      <div className="container flex items-center justify-between">
        {/* Left: Logo & Mobile Nav */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/">
              <img src={logoImg} alt="Bike Shop Logo" className="h-10" />
            </Link>
          </Button>
          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map(link => (
                  <RouterNavLink key={link.to} to={link.to}>
                    {link.name}
                  </RouterNavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right: Auth & Actions & Desktop Nav */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-6">
            {navLinks.map(link => (
              <RouterNavLink key={link.to} to={link.to}>
                {link.name}
              </RouterNavLink>
            ))}
          </nav>

          {/* Auth & Actions */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Dashboard</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'}>
                    Go to Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth/login">
              <Button variant="default" className="hover:cursor-pointer">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
