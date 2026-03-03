import { createAuthClient } from 'better-auth/react'

import { betterAuthAdminClientConfig } from '#/integrations/better-auth/rbac/client';

export const authClient = createAuthClient({
  plugins: [
    betterAuthAdminClientConfig
  ]
})
