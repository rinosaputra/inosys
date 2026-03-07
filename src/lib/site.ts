export const SITE_TITLE = import.meta.env.VITE_APP_NAME || 'Inosys'
export const SITE_DESCRIPTION =
  'Inosys is a software consultancy specializing in building high-quality web applications using modern technologies and best practices. We are passionate about creating performant, scalable, and maintainable solutions that help our clients achieve their business goals.'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000'

// Auth URLs
export const AUTH_LOGIN_URL = import.meta.env.VITE_AUTH_LOGIN_URL || '/login'
export const AUTH_IS_AUTH_URL = import.meta.env.VITE_IS_AUTH_URL || '/dashboard'

// Unauthorized access URL
export const UNAUTHORIZED_URL = import.meta.env.VITE_UNAUTHORIZED_URL || '/unauthorized'

// Protected URLs
export const ACCOUNT_URL = '/account' as string
export const SETTINGS_URL = '/settings' as string
export const NOTIFICATIONS_URL = '/notifications' as string
