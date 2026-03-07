import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { createMeta, type CreateMetaInput } from '#/lib/seo'

import { DataTable } from '#/components/data/table/data-table'
import type { DataSearch } from '#/components/data/schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'

import { orpc } from '#/integrations/orpc/client'

import { adminRBACColumns } from '#/features/admin/rbac/admin-rbac-columns'
import type { AdminRBACQuery } from '#/features/admin/rbac/admin-rbac-schema'
import { AdminRBACQuerySchema, AdminRBACRoleSchema } from '#/features/admin/rbac/admin-rbac-schema'

const metadata: CreateMetaInput = {
  title: "User Management - RBAC",
  description: "Halaman untuk mengelola pengguna di admin RBAC.",
  url: "/admin/rbac",
}

export const Route = createFileRoute('/(protected)/admin/rbac/')({
  component: RouteComponent,
  validateSearch: z.record(z.string(), z.coerce.string().trim()),
  head: () => createMeta(metadata),
})

const parseQuery = (query: DataSearch): AdminRBACQuery => {
  const roles = query.filters.role?.value || []
  const statuses = query.filters.status?.value || []
  const result: AdminRBACQuery = {
    ...query,
    search: query.search.name,
    filters: {
      roles: AdminRBACRoleSchema.array().parse(Array.isArray(roles) ? roles : [roles]) || undefined,
      isActive: statuses.length === 1 ? statuses[0] === 'active' : undefined,
    }
  }
  return AdminRBACQuerySchema.parse(result)
}

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (<Card>
    <CardHeader>
      <div className="flex flex-row gap-2">
        <div className="flex-1">
          <CardTitle>{metadata.title}</CardTitle>
          <CardDescription>
            {metadata.description}
          </CardDescription>
        </div>
        <div>
          <Button size="sm">
            Create New
          </Button>
        </div>
      </div>
    </CardHeader>
    <Separator />
    <CardContent>
      <DataTable {...{
        name: "admin-rbac",
        columns: adminRBACColumns,
        navigate,
        search,
        getData: (query) => {
          return orpc.admin.rbac.findMany.call(parseQuery(query))
        },
        getCount: (query) => {
          return orpc.admin.rbac.count.call(parseQuery(query))
        },
        getFacets: async () => {
          const facets = await orpc.admin.rbac.facets.call()
          return facets
        },
        showRowNumber: true,
        rowActions: (row) => ({
          customActions: [
            {
              label: "This is a link",
              type: "link",
              payload: `#`,
            },
            {
              label: "This is an action",
              type: "action",
              payload: () => alert(`Message sent to ${row.original.name}`)
            }
          ]
        }),
      }} />
    </CardContent>
  </Card>)
}
