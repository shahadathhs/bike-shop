import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Link, useFetcher, useNavigate, type ActionFunctionArgs } from 'react-router'

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

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })

  const data = await response.json()

  if (response.ok) {
    return {
      success: true,
      message: 'Registration successful',
      data,
    }
  } else {
    console.error('Error registering user', data)
    return { error: data.message, errorDetails: data }
  }
}

export default function Register() {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  const navigate = useNavigate()

  useEffect(() => {
    const handleFetcherData = async () => {
      if (fetcher.data?.success) {
        toast.dismiss()
        toast.success(fetcher.data.message)
        //* wait for 1 second before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000))
        navigate('/auth/login')
      } else if (fetcher.data?.error) {
        toast.dismiss()
        toast.error(fetcher.data.error)
      }
    }

    handleFetcherData()
  }, [fetcher.data, navigate])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Register to our website</h1>

      <fetcher.Form method="post" className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="name" className="label mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="input input-bordered w-full"
            required
          />
        </div>
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

        <div>
          <label htmlFor="confirmPassword" className="label mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* link to login page */}
        <div className="text-center">
          Already have an account?{' '}
          <Link to="/auth/login" className="link link-primary">
            Login
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </fetcher.Form>
    </div>
  )
}
