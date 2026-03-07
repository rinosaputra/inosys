import { adminClient } from "better-auth/client/plugins"
import { ac, roles } from "./permission"

export const betterAuthAdminClientConfig = adminClient({
  ac,
  roles
})
