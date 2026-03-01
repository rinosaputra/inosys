import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { betterAuthBasicConfig } from "#/integrations/better-auth/basic/config";

export const auth = betterAuth({
  ...betterAuthBasicConfig,

  plugins: [tanstackStartCookies()],
})

export type Auth = (typeof auth)['$Infer'];
