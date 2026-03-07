import { admin } from "better-auth/plugins"
import {
  ac,
  roles,
  defaultRole,
  adminRoles
 } from "./permission"

export const betterAuthAdminConfig = admin({
  ac,
  roles,
  defaultRole,
  adminRoles
})
