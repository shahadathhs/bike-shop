import { useEffect } from 'react'
import { useFetcher, useNavigation, type ActionFunction } from 'react-router'
import { toast } from 'sonner'
import { authServices } from '~/services/auth.services'

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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (response.ok) {
    const user = data?.data
    const role = user?.role

    // * create user session based on role
    return authServices.createUserSession(
      {
        token: user?.token,
        email: user?.email,
        name: user?.name,
        role: user?.role,
      },
      `/${role}`,
    )
  } else {
    console.error('Error logging in', data)
    return { error: data.message, errorDetails: data }
  }
}

export default function Login() {
  const fetcher = useFetcher()
  const navigation = useNavigation()
  const isSubmitting = fetcher.state === 'submitting'
  const isLoading = navigation.state === 'loading'

  useEffect(() => {
    const handleFetcherData = async () => {
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
    }

    handleFetcherData()
  }, [fetcher.data])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <fetcher.Form method="post" className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="email" className="label mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="label mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </fetcher.Form>
      <div className="text-center mt-4">
        Don&apos;t have an account?{' '}
        <a href="/auth/register" className="link link-primary">
          Register here
        </a>
      </div>
    </div>
  )
}
