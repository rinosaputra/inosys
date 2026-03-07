import { dataSearchSchema, dataTableDirections, dataTableOperators, nonEmptyString } from "#/components/data/schema";
import z from "zod";

export const AdminRBACSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  status: z.enum(['active', 'inactive'])
})

export type AdminRBAC = z.infer<typeof AdminRBACSchema>

export const AdminRBACSelectEnum = ['id', 'name', 'email', 'role', 'status'] as const

export const AdminRBACSelectSchema = z.enum(AdminRBACSelectEnum)

export type AdminRBACSelect = z.infer<typeof AdminRBACSelectSchema>

export const AdminRBACQuerySchema = dataSearchSchema
  .pick({
    pagination: true,
  }).extend({
    search: z.partialRecord(AdminRBACSelectSchema, nonEmptyString).catch({}),
    sorts: z.partialRecord(AdminRBACSelectSchema, dataTableDirections).catch({}),
    filters: z.partialRecord(
      AdminRBACSelectSchema,
      z.object({
        value: z.array(nonEmptyString).or(nonEmptyString),
        operator: dataTableOperators.default("eq"),
      })
    ).catch({}),
  })

export type AdminRBACQuery = z.infer<typeof AdminRBACQuerySchema>
