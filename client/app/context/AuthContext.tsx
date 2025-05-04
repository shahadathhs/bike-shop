import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { TAuthContext, TCookie } from '~/types/user'

const AuthContext = createContext<TAuthContext>({
  token: undefined,
  userId: undefined,
  email: undefined,
  name: undefined,
  setCookieToContext: () => {},
  logout: () => {},
  user: undefined,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cookie, setCookie] = useState<TCookie | null>(null)
  const navigate = useNavigate()

  const setCookieToContext = async (cookie: TCookie) => {
    setCookie(cookie)
  }

  const logout = () => {
    setCookie(null)
    Cookies.remove('accessToken')
    navigate('/')
  }

  const value = {
    token: cookie?.token,
    userId: cookie?.userId,
    email: cookie?.email,
    name: cookie?.name,
    user: cookie?.user,
    logout,
    setCookieToContext,
  }

  // * on cookie change, set cookie (token as accessToken)
  useEffect(() => {
    if (cookie?.token) {
      Cookies.set('accessToken', cookie.token, {
        expires: 10,
      })
    } else if (!cookie?.token) {
      Cookies.remove('accessToken')
    }
  }, [cookie])

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
