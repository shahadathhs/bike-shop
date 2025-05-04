import { createCookieSessionStorage, redirect } from 'react-router'
import type { TCookie } from '~/types/user'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'user_session',
    sameSite: 'none',
    path: '/',
    httpOnly: false,
    secrets: import.meta.env.VITE_SESSION_SECRET || 'super-secret',
    secure: true,
  },
})

// create session func
async function createUserSession({ userId, token, email, name }: TCookie, redirectTo: string) {
  const session = await sessionStorage.getSession()
  session.set('userId', userId)
  session.set('token', token)
  session.set('email', email)
  session.set('name', name)

  // Create headers with multiple Set-Cookie headers
  const headers = new Headers()
  headers.append('Set-Cookie', await sessionStorage.commitSession(session))

  return redirect(redirectTo, { headers })
}

// get user session
async function getUserSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get('Cookie'))
}

// Require authentication middleware
async function requireUserSession(request: Request, redirectTo = '/login') {
  const session = await getUserSession(request)
  const userId = session.get('userId')

  if (!userId) {
    // Create headers with multiple Set-Cookie headers
    const headers = new Headers()
    headers.append('Set-Cookie', await sessionStorage.destroySession(session))

    throw redirect(redirectTo, { headers })
  }

  return userId
}

// Logout session from server
async function logout(request: Request) {
  const session = await getUserSession(request)

  // Create headers with multiple Set-Cookie headers
  const headers = new Headers()
  headers.append('Set-Cookie', await sessionStorage.destroySession(session))

  return redirect('/', { headers })
}

export const AuthServices = {
  createUserSession,
  requireUserSession,
  logout,
}

export const getCookie = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  const token = session.get('token')
  const email = session.get('email')
  const name = session.get('name')

  return { userId, token, email, name }
}
