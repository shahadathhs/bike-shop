
import { isRouteErrorResponse } from 'react-router'
import ErrorComponents from './ErrorComponents'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ErrorBoundaryComponent({ error }: any) {
  let message =
    'Oops! It Looks Like The Page You’re Looking For Isn’t Available.'
  let details = 'It might have been moved or doesn’t exist anymore.'
  let status = 404

  if (isRouteErrorResponse(error)) {
    status = error.status || status
    message = error.statusText || message
    details =
      error.data?.message || 'Something went wrong. Please try again later.'
  } else if (error && error instanceof Error) {
    details = error.message
  }

  return <ErrorComponents status={status} message={message} details={details} />
}
