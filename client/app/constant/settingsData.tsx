import {
  CalendarDays,
  Cog,
  Globe,
  Lock,
  Palette,
  User,
  Bell,
  Shield,
  Zap,
} from 'lucide-react'

export const settingsCards = [
  {
    icon: <User className="h-5 w-5" />,
    title: 'Profile',
    description: 'Manage your personal information and account details',
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: 'Appearance',
    description: 'Customize the look and feel of your dashboard',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Security',
    description: 'Configure your security preferences and two-factor authentication',
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: 'Notifications',
    description: 'Control how and when you receive notifications',
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: 'Privacy',
    description: 'Manage your privacy settings and data sharing preferences',
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: 'Regional',
    description: 'Set your language, timezone, and regional preferences',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Performance',
    description: 'Optimize your dashboard performance and resource usage',
  },
  {
    icon: <CalendarDays className="h-5 w-5" />,
    title: 'Time & Date',
    description: 'Configure how dates and times are displayed',
  },
  {
    icon: <Cog className="h-5 w-5" />,
    title: 'Advanced',
    description: 'Access advanced configuration options and developer settings',
  },
]