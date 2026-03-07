// File: src/integrations/better-auth/rbac/permission.ts
import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

// Merge default statements dari admin plugin + tambahan app-specific resource (optional)
export const statement = {
  ...defaultStatements,

  // App-specific gate untuk area /admin (opsional tapi berguna untuk check permission via hasPermission)
  admin_area: ["view"] as const,

  // Contoh resource tambahan, misal "member_area" yang hanya bisa diakses oleh role tertentu
  member_area: ["view"] as const,
} as const

export const ac = createAccessControl(statement)

// Roles:
// - superadmin: full power admin plugin + boleh delete
export const superadmin = ac.newRole({
  admin_area: ["view"],
  ...adminAc.statements,
})

// - admin: sama seperti superadmin tapi tanpa delete user
// adminAc.statements.user biasanya berisi action termasuk "delete" (sesuai dok yang kamu paste),
// jadi kita override khusus resource "user" untuk membuang "delete".
export const admin = ac.newRole({
  admin_area: ["view"],
  ...adminAc.statements,

  // override user permissions: hapus "delete"
  user: adminAc.statements.user.filter((a) => a !== "delete"),
})
// - member: tidak bisa akses admin
export const member = ac.newRole({
  member_area: ["view"]
})


export const roles = {
  member,
  superadmin,
  admin
}

// Type helper
export type Role = keyof typeof roles

export const defaultRole: Role = "member"

export const adminRoles: Role[] = ["superadmin", "admin"]
