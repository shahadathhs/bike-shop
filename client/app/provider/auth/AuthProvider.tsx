import { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { AuthContext } from './AuthContext'
import { useNavigate } from 'react-router'

export interface IUser {
  token: string
  name: string
  email: string
  role: string
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | any>(null)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // * Retrieve the stored user from cookies
      const storedUser = Cookies.get('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Error parsing user cookie:', error)
        }
      }
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      if (user) {
        // * Store the user in a cookie (expires in 3 days)
        Cookies.set('user', JSON.stringify(user), { expires: 3 })
      } else {
        Cookies.remove('user')
      }
    }
  }, [user, mounted])

  const login = (user: IUser) => {
    setUser(user)
    Cookies.set('user', JSON.stringify(user), { expires: 3 })
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('user')
    navigate('/')
  }

  const authInfo = useMemo(() => ({ user, setUser, login, logout }), [user])

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
}
