import z from "zod"

export const roleEnum = z.enum(["member", "admin", "superadmin"])
export const statusEnum = z.enum(["active", "banned"])

export const userRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: roleEnum,
  status: statusEnum,
  lastSeenAt: z.iso.datetime(),
  createdAt: z.iso.datetime()
})

export type UserRow = z.infer<typeof userRowSchema>

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: roleEnum.array().optional(),
  status: statusEnum.array().optional(),
  sortBy: z.enum(["name", "email", "role", "status", "lastSeenAt", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional()
})

export type UserQuery = z.infer<typeof userQuerySchema>
