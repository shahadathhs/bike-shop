import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import type { TAuthContext, TCookie } from '~/types/user'

const AuthContext = createContext<TAuthContext>({
  token: undefined,
  email: undefined,
  name: undefined,
  role: undefined,
  logout: () => {},
  setCookieToContext: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cookie, setCookie] = useState<TCookie | null>(JSON.parse(Cookies.get('cookie') || 'null'))

  const setCookieToContext = async (cookie: TCookie) => {
    setCookie(cookie)
  }

  const logout = () => {
    setCookie(null)
    Cookies.remove('cookie')
  }

  // * useEffect to set cookie in the browser
  // * just set, don't remove inside useEffect
  useEffect(() => {
    if (cookie) {
      Cookies.set('cookie', JSON.stringify(cookie))
    }
  }, [cookie])

  const value = {
    token: cookie?.token,
    email: cookie?.email,
    name: cookie?.name,
    role: cookie?.role,
    logout,
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
