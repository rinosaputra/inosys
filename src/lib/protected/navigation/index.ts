import type { NavigationItem } from "./types";

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: 'fa-solid fa-gauge' },
  {
    label: 'Admin',
    to: '/admin',
    icon: 'fa-solid fa-shield-halved',
    requiredRoles: ['admin'],
    children: [
      { label: 'Users', to: '/admin/users', icon: 'fa-solid fa-users', requiredRoles: ['admin'] },
      { label: 'Sessions', to: '/admin/sessions', icon: 'fa-solid fa-clock', requiredRoles: ['admin'] },
    ],
  },
]
