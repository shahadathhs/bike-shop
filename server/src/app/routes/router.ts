import { Router } from 'express'

import { AuthRoutes } from '../modules/auth/auth.route'
import { bikeRoutes } from '../modules/bike/bike.route'
import { orderRoutes } from '../modules/order/order.route'

const appRoutes = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/products',
    route: bikeRoutes
  },
  {
    path: '/orders',
    route: orderRoutes
  }
]

moduleRoutes.forEach(route => appRoutes.use(route.path, route.route))

export default appRoutes
