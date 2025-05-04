import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import type { TAuthContext, TCookie } from '~/types/user'

const AuthContext = createContext<TAuthContext>({
  token: undefined,
  email: undefined,
  name: undefined,
  role: undefined,
  setCookieToContext: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cookie, setCookie] = useState<TCookie | null>(JSON.parse(Cookies.get('cookie') || 'null'))

  const setCookieToContext = (newCookie: TCookie | null) => {
    setCookie(newCookie)

    if (newCookie) {
      // preserve or update
      Cookies.set('cookie', JSON.stringify(newCookie), { path: '/' })
    } else {
      // explicit removal
      Cookies.remove('cookie', { path: '/' })
    }
  }

  useEffect(() => {
    if (cookie) {
      Cookies.set('cookie', JSON.stringify(cookie), { path: '/' })
    } else {
      Cookies.remove('cookie', { path: '/' })
    }
  }, [cookie])

  const value = {
    token: cookie?.token,
    email: cookie?.email,
    name: cookie?.name,
    role: cookie?.role,
    setCookieToContext,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useCookie must be used within a AuthProvider')
  }
  return context
}

export const useToken = () => {
  const { token } = useAuth()
  return token
}
