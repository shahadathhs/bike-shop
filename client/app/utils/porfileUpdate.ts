import { getCookie, authServices } from '~/services/auth.services'

export const handleProfileAction = async (
  request: Request,
  redirectTo: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redirect: any,
) => {
  const formData = await request.formData()
  const actionType = formData.get('_action')

  const session = await getCookie(request)
  if (!session.token) return redirect('/login')

  let apiRes: Response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any

  if (actionType === 'profile') {
    const name = formData.get('name')
    apiRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email: session.email }),
    })
    body = await apiRes.json()
  } else if (actionType === 'password') {
    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    const confirmPassword = formData.get('confirmPassword')

    if (newPassword !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

    apiRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-password`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    body = await apiRes.json()
  } else {
    return { error: 'Invalid action' }
  }

  if (!apiRes.ok) {
    return { error: body.message || 'Update failed' }
  }

  const { token, name, email, role } = body.data
  return authServices.createUserSession({ token, name, email, role }, redirectTo)
}
