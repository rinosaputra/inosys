import { authorized } from "#/integrations/orpc/middleware/auth";
import type { Prisma } from "@generated/prisma/client";

import { AdminRBACQuerySchema, AdminRBACSchema, type AdminRBAC, type AdminRBACQuery } from "./admin-rbac-schema";
import prisma from "#/lib/prisma";
import type { Role } from "#/integrations/better-auth/rbac/permission";

const createAdminRBACWhereInput = (input: Pick<AdminRBACQuery, "filters" | "search">): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};
  if (input.search) {
    where.OR = [
      { name: { contains: input.search, mode: 'insensitive' } },
      { email: { contains: input.search, mode: 'insensitive' } },
    ]
  }
  if (input.filters.isActive !== undefined) {
    where.banned = !input.filters.isActive;
  }
  if (input.filters.roles?.length) {
    where.role = input.filters.roles.length > 1 ? { in: input.filters.roles } : input.filters.roles[0];
  }
  return where;
}

const parseAdminRBACData = (user: Prisma.UserGetPayload<{}>): AdminRBAC => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: (user.role as Role) || 'member',
  status: user.banned ? 'inactive' : 'active',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export const adminRBACRoute = {
  findMany: authorized
    .input(AdminRBACQuerySchema)
    .output(AdminRBACSchema.array())
    .handler(async ({ input }) => {
      const results = await prisma.user.findMany({
        where: createAdminRBACWhereInput(input),
        orderBy: Object.entries(input.sorts || {}).map(([key, direction]) => ({ [key]: direction })),
        skip: input.pagination?.index * input.pagination?.limit,
        take: input.pagination?.limit,
      })

      return results.map(parseAdminRBACData)
    }),
  count: authorized
    .input(AdminRBACQuerySchema.pick({ search: true, filters: true }))
    .handler(async ({ input }) => {
      const count = await prisma.user.count({
        where: createAdminRBACWhereInput(input),
      })
      return count
    }),
  facets: authorized
    .handler(async () => {
      const [statusFacet, roleFacet] = await Promise.all([
        prisma.user.groupBy({
          by: ['banned'],
          _count: {
            _all: true
          }
        }),
        prisma.user.groupBy({
          by: ['role'],
          _count: {
            _all: true
          }
        })
      ])
      const defaultRecord: Record<string, number> = {}
      return {
        status: statusFacet.reduce((acc, { banned, _count }) => ({
          ...acc,
          [banned ? 'inactive' : 'active']: _count._all + (acc[banned ? 'inactive' : 'active'] || 0)
        }), {...defaultRecord}),
        role: roleFacet.reduce((acc, { role, _count }) => ({
          ...acc,
          [role || 'member']: _count._all + (acc[role || 'member'] || 0)
        }), {...defaultRecord})
      }
    }),
  findById: authorized
    .input(AdminRBACSchema.pick({ id: true }))
    .output(AdminRBACSchema)
    .handler(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
      })
      if (!user) {
        throw new Error('User not found')
      }
      return parseAdminRBACData(user)
    })
}
