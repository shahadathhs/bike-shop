import { useEffect } from 'react'
import { Link, Outlet, redirect, useLoaderData } from 'react-router'
import { adminNavItems } from '~/constant/navigationLinks'
import { useAuth } from '~/context/AuthContext'
import { authServices } from '~/services/auth.services'
import type { TCookie } from '~/types/user'

export const loader = async ({ request }: { request: Request }) => {
  // * This ensures only authenticated users can access the dashboard
  await authServices.requireUserSession(request)

  const url = new URL(request.url)
  const pathname = url.pathname

  // * redirect to analytics page if the user is on the dashboard route
  if (pathname === 'admin') return redirect('admin/analytics')

  const cookie = await authServices.getCookie(request)

  return { cookie }
}

export default function DashboardAdminLayout() {
  const { cookie } = useLoaderData<{ cookie: TCookie }>()

  const { setCookieToContext } = useAuth()

  // * Set cookie to context when cookie data changes
  useEffect(() => {
    if (cookie) {
      setCookieToContext(cookie) // * don't set cookie to context if it's null
    }
  }, [cookie, setCookieToContext])

  return (
    <main className="min-h-screen w-full flex justify-between">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-start">
          {/* Page content here */}
          <Outlet />

          {/* button to open drawer in mobile view */}
          <div className="fixed top-4 right-4 z-50">
            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
              Open Menu
            </label>
          </div>
        </div>

        {/* Drawer side content here */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full flex flex-col justify-between w-40 p-4">
            {/* Sidebar content here */}
            <li>
              {adminNavItems.map(item => (
                <Link key={item.label} to={item.route} className="btn btn-ghost text-md">
                  {item.label}
                </Link>
              ))}
            </li>

            {/* Logout button and Theme toggle */}
            <li>
              {/* Logout button */}
              {/* <button onClick={logout} className="btn btn-error mb-2">
                Logout
              </button> */}
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
