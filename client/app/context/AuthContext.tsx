import { createContext, useContext, useState } from 'react'
import type { TAuthContext, TCookie } from '~/types/user'

const AuthContext = createContext<TAuthContext>({
  token: undefined,
  email: undefined,
  name: undefined,
  role: undefined,
  setCookieToContext: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cookie, setCookie] = useState<TCookie | null>(null)

  const setCookieToContext = (newCookie: TCookie | null) => {
    setCookie(newCookie)
  }

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
