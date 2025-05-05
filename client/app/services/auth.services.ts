import { createCookieSessionStorage, redirect } from 'react-router'
import type { TCookie } from '~/types/user'

// * define session storage
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

// * get user session
export async function getUserSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get('Cookie'))
}

// * get user session data
export const getCookie = async (request: Request) => {
  const session = await getUserSession(request)

  const token = session.get('token')
  const email = session.get('email')
  const name = session.get('name')
  const role = session.get('role')

  return { token, email, name, role }
}

// * create session function
async function createUserSession({ token, email, name, role }: TCookie, redirectTo: string) {
  const session = await sessionStorage.getSession()

  session.set('token', token)
  session.set('email', email)
  session.set('name', name)
  session.set('role', role)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

// * Require authentication middleware
async function requireUserSession(request: Request, redirectTo = '/login') {
  const session = await getUserSession(request)
  const token = await session.get('token')

  if (!token) {
    throw redirect(redirectTo, {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session),
      },
    })
  }

  return token
}

// * Logout session from server
async function logout(request: Request) {
  const session = await getUserSession(request)

  if (!session) return redirect('/')

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

async function updateNameInSession(name: string, request: Request, redirectTo: string) {
  const session = await getUserSession(request)

  session.set('name', name)

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  })
}

export const authServices = {
  createUserSession,
  requireUserSession,
  logout,
  updateNameInSession,
  getCookie,
  getUserSession,
  sessionStorage,
}
