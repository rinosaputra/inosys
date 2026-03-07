import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { betterAuthBasicConfig } from "#/integrations/better-auth/basic/config";
import { betterAuthAdminConfig } from "#/integrations/better-auth/rbac/config";


export const auth = betterAuth({
  ...betterAuthBasicConfig,

  plugins: [
    tanstackStartCookies(),
    betterAuthAdminConfig
  ],

})

export type Auth = (typeof auth)['$Infer'];
