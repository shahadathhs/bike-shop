import { Router } from 'express'

import { AuthRoutes } from '../modules/auth/auth.route'
import { bikeRoutes } from '../modules/bike/bike.route'
import { orderRoutes } from '../modules/order/order.route'
import { paymentRoutes } from '../modules/payments/payment.route'

const appRoutes = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/bikes',
    route: bikeRoutes
  },
  {
    path: '/orders',
    route: orderRoutes
  },
  {
    path: '/payments',
    route: paymentRoutes
  }
]

moduleRoutes.forEach(route => appRoutes.use(route.path, route.route))

export default appRoutes
