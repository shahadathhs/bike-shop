import { type ActionFunction } from 'react-router'
import { authServices } from '~/services/auth.services'

export const action: ActionFunction = async ({ request }) => {
  return await authServices.logout(request)
}
