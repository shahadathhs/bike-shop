export type TRole = 'admin' | 'customer'

export type TUser = {
  _id: string
  name: string
  email: string
  password: string
  role: TRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  token: string
}

export type TCookie = {
  userId: string
  token: string
  email: string
  name: string
  user: TUser
}

export type TAuthContext = {
  token: string | undefined
  userId: string | undefined
  email: string | undefined
  name: string | undefined
  user: TUser | undefined
  setCookieToContext: (cookie: TCookie) => void
  logout: () => void
}
