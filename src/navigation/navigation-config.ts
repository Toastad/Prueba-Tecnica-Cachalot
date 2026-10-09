import type { NavigationIconName } from '../components/NavigationIcon'

export type NavigationItem = {
  label: string
  to: string
  icon: NavigationIconName
  keywords: string[]
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', to: '/', icon: 'dashboard', keywords: ['home', 'overview', 'stats'] },
  {
    label: 'Contacts',
    to: '/contacts',
    icon: 'contacts',
    keywords: ['clients', 'directory', 'people'],
  },
  {
    label: 'Transactions',
    to: '/transactions',
    icon: 'trend',
    keywords: ['activity', 'growth', 'weekly'],
  },
  {
    label: 'Accounts',
    to: '/accounts',
    icon: 'stack',
    keywords: ['pipeline', 'stages', 'funnel'],
  },
  {
    label: 'Reports',
    to: '/reports',
    icon: 'chart',
    keywords: ['analytics', 'insights', 'tables'],
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: 'gear',
    keywords: ['preferences', 'theme', 'notifications'],
  },
]

export const pageTitleByPath: Record<string, string> = {
  '/': 'Overview',
  '/contacts': 'Contacts',
  '/transactions': 'Transactions',
  '/accounts': 'Accounts',
  '/reports': 'Reports',
  '/settings': 'Settings',
}
