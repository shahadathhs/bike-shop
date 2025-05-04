import './app.css'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from 'react-router'
import type { Route } from './+types/root'
import { useEffect, useState } from 'react'
import { ErrorBoundaryComponent } from '~/components/error/ErrorBoundaryComponent'
import Loading from './components/shared/Loading'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './components/ui/theme-provider'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function meta() {
  return [{ title: 'Bike Store' }, { name: 'description', content: 'Welcome to Bike Store' }]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <link rel="icon" href={`/favicon.ico?v=${Date.now()}`} type="image/x-icon" />
      </head>
      <body>
        <Toaster />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  //* show a loading indicator while the app is initializing
  if (!isClient) return <Loading />

  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  return <ErrorBoundaryComponent error={error} />
}
