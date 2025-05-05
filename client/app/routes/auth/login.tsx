import { useEffect, useState } from 'react'
import { useFetcher, useNavigation, type ActionFunction } from 'react-router'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'
import { authServices } from '~/services/auth.services'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Link } from 'react-router'
import { Label } from '~/components/ui/label'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || !email.trim()) {
    return { error: 'Email is required' }
  }

  if (typeof password !== 'string' || !password.trim()) {
    return { error: 'Password is required' }
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (response.ok) {
    const user = data?.data
    return authServices.createUserSession(
      {
        token: user.token,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      `/${user.role}`,
    )
  } else {
    console.error('Error logging in', data)
    return { error: data.message, errorDetails: data }
  }
}

export default function Login() {
  const fetcher = useFetcher()
  const navigation = useNavigation()
  const [submitted, setSubmitted] = useState(false)

  const isSubmitting = fetcher.state === 'submitting'
  const isLoading = navigation.state === 'loading'

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message || 'Login successful', {
        duration: 2000,
        description: 'Redirecting to dashboard...',
      })
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error, {
        description: fetcher.data.errorDetails?.message,
      })
    }
  }, [fetcher.data])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (err) {
      console.error('Error copying to clipboard:', err)
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center mt-10">
      {/* Welcome Column */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10 border-r">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="text-lg">
            Sign in to manage your orders, track shipments, and explore exclusive offers.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Personalized dashboard</li>
            <li>Quick checkout</li>
            <li>Order tracking</li>
          </ul>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex w-full lg:w-1/2 items-center justify-center md:p-6">
        <Card className="w-full md:max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post" className="space-y-4" onSubmit={() => setSubmitted(true)}>
              {/* admin credentials */}
              <div className="text-center border rounded p-2 relative">
                <h3 className="text-lg font-semibold">Admin Credentials</h3>
                <div className="flex items-center justify-center space-x-2">
                  <span>
                    Email: <span className="text-primary">admin@gmail.com</span>
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard('admin@gmail.com')}
                  >
                    <Copy size={4} />
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>
                    Password: <span className="text-primary">admin</span>
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard('admin')}
                  >
                    <Copy size={4} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-4 hover:cursor-pointer"
                disabled={(isSubmitting || isLoading) && submitted}
              >
                {(isSubmitting || isLoading) && submitted ? 'Logging in...' : 'Login'}
              </Button>
            </fetcher.Form>

            <p className="mt-4 text-center text-sm">
              Don’t have an account?{' '}
              <Link to="/register" className="underline">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
