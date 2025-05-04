import { useAuth } from '~/provider/auth/AuthContext'
import { Link, NavLink } from 'react-router'
import logoImg from 'assets/logo.png'
import { navLinks } from '~/constant/navigationLinks'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'

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
  const [open, setOpen] = useState(false)

  return (
    <header className="border bg-background p-3 md:p-4 my-2 rounded shadow-sm">
      <div className="container flex items-center justify-between">
        {/* Left: Logo & Mobile Nav */}
        <div className="flex items-center">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <img src={logoImg} alt="Bike Shop Logo" className="h-5 md:h-10" />
            </Link>
          </Button>
          {/* Mobile Nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTitle className="hidden lg:block"></SheetTitle>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-40">
              <nav className="flex flex-col mt-6 p-4">
                {navLinks.map(link => (
                  <Button
                    key={link.to}
                    variant="ghost"
                    size="sm"
                    className="text-left"
                    onClick={() => setOpen(false)}
                  >
                    <RouterNavLink to={link.to}>{link.name}</RouterNavLink>
                  </Button>
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
