import Cookies from 'js-cookie'
import { redirect } from 'react-router'

export const getToken = () => {
  const token = Cookies.get('token')
  if (!token) {
    return redirect('/auth/login')
  }

  return token
}
