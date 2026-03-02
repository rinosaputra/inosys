/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
  readonly VITE_APP_NAME: string
  readonly VITE_SITE_URL: string

  // Auth URLs
  readonly VITE_AUTH_LOGIN_URL: string
  readonly VITE_IS_AUTH_URL: string
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
      readonly DB_HOST: string
      readonly DB_PORT: string
      readonly DB_USER: string
      readonly DB_PASSWORD: string
      readonly DB_NAME: string
    }
  }
}

export { }
