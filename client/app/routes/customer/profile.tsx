import {
  type ActionFunction,
  type LoaderFunction,
  useLoaderData,
  useActionData,
  Form,
  useNavigation,
  redirect,
} from 'react-router'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import Loading from '~/components/shared/Loading'
import type { TCookie } from '~/types/user'
import { authServices, getCookie } from '~/services/auth.services'

// Loader: fetch existing session data
export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)
  // ensure all fields present
  if (!cookie.token) {
    // if no token, redirect to login
    return redirect('/login')
  }
  return { cookie }
}

// Action: handle profile or password update
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const actionType = formData.get('_action')

  // get old session to extract existing role/email
  const old = await getCookie(request)
  if (!old.token) {
    return redirect('/login')
  }

  let apiRes: Response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any

  if (actionType === 'profile') {
    const name = formData.get('name')
    apiRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${old.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email: old.email }),
    })
    body = await apiRes.json()
  } else if (actionType === 'password') {
    const currentPassword = formData.get('currentPassword')
    const newPassword = formData.get('newPassword')
    apiRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-password`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${old.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    body = await apiRes.json()
  } else {
    return { error: 'Invalid action' }
  }

  if (!apiRes.ok) {
    // return error to component
    return { error: body.message || 'Update failed' }
  }

  // extract updated user info & token
  const { token, name, email, role } = body.data

  // update session cookie and redirect back
  return authServices.createUserSession({ token, name, email, role }, '/customer/profile')
}

export default function CustomerProfile() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()
  const actionData = useActionData<{ error?: string }>()
  const navigation = useNavigation()

  if (!cookie.email || !cookie.name) {
    return <Loading />
  }

  const isSubmittingProfile =
    navigation.formData?.get('_action') === 'profile' && navigation.state === 'submitting'
  const isSubmittingPassword =
    navigation.formData?.get('_action') === 'password' && navigation.state === 'submitting'

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto lg:flex lg:space-x-8">
        <Card className="hidden lg:block lg:w-1/3">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-xl font-bold">Your Account</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4 text-sm">
            <p>Manage your profile and keep your account secure.</p>
          </CardContent>
        </Card>

        <div className="lg:flex-1 space-y-8">
          {actionData?.error && <div className="text-red-600">{actionData.error}</div>}

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" replace className="space-y-4">
                <input type="hidden" name="_action" value="profile" />
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={cookie.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (read-only)</Label>
                  <Input id="email" name="email" defaultValue={cookie.email} disabled />
                </div>
                <Button type="submit" disabled={isSubmittingProfile} className="mt-2">
                  {isSubmittingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </CardContent>
          </Card>

          {/* Password Form */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" replace className="space-y-4">
                <input type="hidden" name="_action" value="password" />
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" required />
                </div>
                <Button type="submit" variant="secondary" disabled={isSubmittingPassword}>
                  {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
