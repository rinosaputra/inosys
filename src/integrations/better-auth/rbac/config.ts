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
  adminRoles,
  adminUserIds: (process.env.RBAC_ADMIN_IDS || '').split(',').map(id => id.trim()).filter(Boolean)
})
