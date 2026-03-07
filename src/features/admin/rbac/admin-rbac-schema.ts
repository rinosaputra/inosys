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

export const AdminRBACQuerySchema = z.object({
  searchValue: z.string().optional(),
  searchField: z.enum(AdminRBACSelectEnum).optional(),
  searchOperator: z.enum(['contains', 'eq', 'startsWith', 'endsWith']).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(AdminRBACSelectEnum).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  filterField: z.enum(AdminRBACSelectEnum).optional(),
  filterValue: z.string().optional(),
  filterOperator: z.enum(['eq', 'ne', 'gt', 'lt', 'in']).optional()
})

export type AdminRBACQuery = z.infer<typeof AdminRBACQuerySchema>
