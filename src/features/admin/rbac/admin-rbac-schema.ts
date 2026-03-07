import { dataSearchSchema, dataTableDirections, nonEmptyString } from "#/components/data/schema";
import z from "zod";

export const AdminRBACRoleSchema = z.enum(['superadmin', 'admin', 'member'])

export const AdminRBACSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: AdminRBACRoleSchema,
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
      roles: AdminRBACRoleSchema.array().optional(),
    }).partial(),
  })

export type AdminRBACQuery = z.infer<typeof AdminRBACQuerySchema>
