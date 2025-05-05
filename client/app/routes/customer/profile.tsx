import React, { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '~/context/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import Loading from '~/components/shared/Loading'
import { getCookie } from '~/services/auth.services'
import { useLoaderData, type LoaderFunction } from 'react-router'
import type { TCookie } from '~/types/user'

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  return { cookie }
}

export default function CustomerProfile() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()
  console.log('cookie', cookie)

  const name = cookie?.name || ''
  const email = cookie?.email || ''

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingProfile(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Profile updated successfully!')
      } else {
        throw new Error(data.message)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile')
    }
    setLoadingProfile(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        duration: 3000,
        position: 'top-center',
      })
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long', {
        duration: 3000,
        position: 'top-center',
      })
      return
    }
    setLoadingPassword(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/update-password`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        throw new Error(data.message)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password')
    }
    setLoadingPassword(false)
  }

  if (!email || !name) return <Loading />

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto lg:flex lg:space-x-8">
        {/* Left Text Column */}
        <Card className="hidden lg:block lg:w-1/3">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-xl font-bold">Your Account</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4 text-sm">
            <p>
              Welcome to your profile dashboard. Here you can update your personal information,
              change your password, and manage your account settings.
            </p>
            <p>
              Keeping your profile up to date ensures you receive all order notifications and
              special offers tailored to you.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Update your display name and contact info</li>
              <li>Secure your account with a strong password</li>
              <li>Review your recent orders and preferences</li>
            </ul>
          </CardContent>
        </Card>

        {/* Right Form Column */}
        <div className="lg:flex-1 space-y-8">
          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (read-only)</Label>
                  <Input id="email" value={email} disabled />
                </div>
                <Button type="submit" disabled={loadingProfile} className="mt-2">
                  {loadingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Form */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={loadingPassword}>
                  {loadingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
