import { useFetcher } from 'react-router'
import { useAuth } from '~/context/AuthContext'
import { LogOut, User } from 'lucide-react'
import { Link } from 'react-router'
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
import type { TCookie } from '~/types/user'

export default function ProfileDropdown({
  userRole,
  setShowLoginButton = () => {},
}: {
  userRole: string
  setShowLoginButton?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { setCookieToContext } = useAuth()

  const fetcher = useFetcher()

  const handleLogout = () => {
    setCookieToContext(null as unknown as TCookie)
    if (setShowLoginButton) {
      setShowLoginButton(true)
    }
    fetcher.submit(null, { method: 'post', action: '/api/logout' })
  }

  return (
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
  )
}
