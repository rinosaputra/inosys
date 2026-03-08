/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
  readonly VITE_APP_NAME: string
  readonly VITE_SITE_URL: string

  // Auth URLs
  readonly VITE_AUTH_LOGIN_URL: string
  readonly VITE_IS_AUTH_URL: string

  // Unauthorized access URL
  readonly VITE_UNAUTHORIZED_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      // Database connection variables
      readonly DATABASE_URL: string

      // Env for RBAC
      readonly RBAC_ADMIN_IDS: string
    }
  }
}

export { }
