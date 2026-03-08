import { dataSearchSchema, dataTableDirections, nonEmptyString } from "#/components/data/schema";
import { roles, type Role } from "#/integrations/better-auth/rbac/permission";
import z from "zod";

export const AdminRBACRoleEnum = Object.keys(roles) as [Role, ...Role[]]

export const AdminRBACRoleField = z.enum(AdminRBACRoleEnum)

export const AdminRBACSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: AdminRBACRoleField,
  status: z.enum(['active', 'inactive']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AdminRBAC = z.infer<typeof AdminRBACSchema>

export const AdminRBACSelectEnum = ['id', 'name', 'email', 'role', 'status', 'createdAt', 'updatedAt'] as const

export const AdminRBACSelectSchema = z.enum(AdminRBACSelectEnum)

export type AdminRBACSelect = z.infer<typeof AdminRBACSelectSchema>

export const AdminRBACQuerySchema = dataSearchSchema
  .pick({
    pagination: true,
  }).extend({
    search: nonEmptyString.optional(),
    sorts: z.partialRecord(AdminRBACSelectSchema, dataTableDirections).catch({}),
    filters: z.object({
      isActive: z.boolean().optional(),
      roles: AdminRBACRoleField.array().optional(),
    }).partial(),
  })

export type AdminRBACQuery = z.infer<typeof AdminRBACQuerySchema>

export const AdminRBACStatusUpdateSchema = AdminRBACSchema
  .pick({
    id: true,
    status: true,
  })

export type AdminRBACStatusUpdate = z.infer<typeof AdminRBACStatusUpdateSchema>

export const AdminRBACChangePasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters long')
  })
  .and(AdminRBACSchema.pick({
    id: true,
  }))

export type AdminRBACChangePassword = z.infer<typeof AdminRBACChangePasswordSchema>

export const AdminRBACCreateSchema = AdminRBACSchema
  .pick({
    name: true,
    email: true,
    role: true,
  })
  .extend({
    password: z.string().min(6, 'Password must be at least 6 characters long')
  })

export type AdminRBACCreate = z.infer<typeof AdminRBACCreateSchema>

export const AdminRBACUpdateSchema = AdminRBACSchema
  .pick({
    id: true,
    name: true,
  })

export type AdminRBACUpdate = z.infer<typeof AdminRBACUpdateSchema>

