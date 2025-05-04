import { useEffect } from 'react'
import { Link, useFetcher, useNavigate, type ActionFunctionArgs } from 'react-router'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Name is required' }
  }
  if (typeof email !== 'string' || !email.trim()) {
    return { error: 'Email is required' }
  }
  if (typeof password !== 'string' || !password.trim()) {
    return { error: 'Password is required' }
  }
  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long' }
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await response.json()
    if (response.ok) {
      return { success: true, message: 'Registration successful' }
    } else {
      return { success: false, error: data.message, errorDetails: data }
    }
  } catch (error) {
    return { success: false, error: 'Registration failed', errorDetails: error }
  }
}

export default function Register() {
  const fetcher = useFetcher()
  const navigate = useNavigate()
  const isSubmitting = fetcher.state === 'submitting'

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message, {
        icon: '🎉',
        description: 'Redirecting to login...',
      })
      setTimeout(() => navigate('/login'), 1000)
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error, {
        icon: '❌',
        description: fetcher.data.errorDetails?.message,
      })
    }
  }, [fetcher.data, navigate])

  return (
    <div className="min-h-[500px] flex flex-col lg:flex-row mt-10">
      {/* Left: Welcome Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-10 border-r">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold">Join Our Community</h2>
          <p className="text-lg">
            Create an account to track orders, save favorites, and receive exclusive offers.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Access to order history</li>
            <li>Personalized recommendations</li>
            <li>Exclusive member discounts</li>
          </ul>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center md:p-6">
        <Card className="w-full md:max-w-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-center">Join Us</CardTitle>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" placeholder="Your full name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you~example.com"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </fetcher.Form>

            <p className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="underline">
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
