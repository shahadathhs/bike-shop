import { useState } from 'react'
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
import { Eye, EyeOff } from 'lucide-react'
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
    const confirmPassword = formData.get('confirmPassword')

    // Client-side validation is also done in the component
    if (newPassword !== confirmPassword) {
      return { error: 'Passwords do not match' }
    }

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

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password values for real-time validation
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  // Check if passwords match whenever either password changes
  const validatePasswords = (newPwd: string, confirmPwd: string) => {
    if (confirmPwd === '') {
      // Don't show error when confirm field is empty
      setPasswordsMatch(true)
      return
    }
    setPasswordsMatch(newPwd === confirmPwd)
  }

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

                {/* Current Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showCurrentPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => {
                        const value = e.target.value
                        setNewPassword(value)
                        validatePasswords(value, confirmPassword)
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showNewPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => {
                        const value = e.target.value
                        setConfirmPassword(value)
                        validatePasswords(newPassword, value)
                      }}
                      className={!passwordsMatch ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                  {!passwordsMatch && (
                    <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  disabled={
                    isSubmittingPassword ||
                    !passwordsMatch ||
                    (newPassword !== '' && confirmPassword === '')
                  }
                >
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
