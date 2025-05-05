import { type ActionFunction, type LoaderFunction, redirect } from 'react-router'
import { getCookie } from '~/services/auth.services'
import Profile from '~/components/profile/Profile'
import { handleProfileAction } from '~/utils/porfileUpdate'

// Loader: fetch existing session data
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  if (!cookie.token) return redirect('/login')

  return { cookie }
}

// Action: handle profile or password update
export const action: ActionFunction = async ({ request }) => {
  return handleProfileAction(request, '/customer/profile', redirect)
}

export default function CustomerProfile() {
  return <Profile />
}
