import {
  BarChart3,
  Home,
  Package,
  PersonStanding,
  Settings,
  Settings2,
  ShoppingCart,
  Users,
} from 'lucide-react'

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
    title: 'Profile',
    to: '/admin/profile',
    icon: PersonStanding,
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

  {
    title: 'Settings',
    to: '/admin/setting',
    icon: Settings2,
  },
]

export const customerNavItems: NavigationItem[] = [
  {
    title: 'Home',
    to: '/',
    icon: Home,
  },
  {
    title: 'My Cart',
    to: '/cart',
    icon: ShoppingCart,
  },
  {
    title: 'Profile',
    to: '/customer/profile',
    icon: PersonStanding,
  },
  {
    title: 'Orders',
    to: '/customer/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Settings',
    to: '/customer/setting',
    icon: Settings,
  },
]
