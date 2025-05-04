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
  token: string
  email: string
  name: string
  role: TRole
}

export type TAuthContext = {
  token: string | undefined
  email: string | undefined
  name: string | undefined
  role: TRole | undefined
  setCookieToContext: (cookie: TCookie) => void
}
