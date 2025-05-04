import { BarChart3, Home, Package, PersonStanding, ShoppingCart, Users } from 'lucide-react'

export interface NavigationItem {
  title: string
  to: string
  icon: React.ElementType
}

export const adminNavItems: NavigationItem[] = [
  {
    title: 'Home',
    to: '/',
    icon: Home,
  },
  {
    title: 'Analytics',
    to: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Products',
    to: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    to: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    to: '/admin/users',
    icon: Users,
  },
]

export const customerNavItems: NavigationItem[] = [
  {
    title: 'Home',
    to: '/',
    icon: Home,
  },
  {
    title: 'Orders',
    to: '/customer/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Profile',
    to: '/customer/profile',
    icon: PersonStanding,
  },
]
