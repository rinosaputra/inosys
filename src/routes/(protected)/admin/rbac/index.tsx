import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

import { DataTable } from '#/components/data/table/data-table'
import type { DataSearch } from '#/components/data/schema'

import { orpc } from '#/integrations/orpc/client'

import { adminRBACColumns } from '#/features/admin/rbac/admin-rbac-columns'
import type { AdminRBACQuery } from '#/features/admin/rbac/admin-rbac-schema'
import { AdminRBACQuerySchema, AdminRBACRoleSchema } from '#/features/admin/rbac/admin-rbac-schema'

export const Route = createFileRoute('/(protected)/admin/rbac/')({
  component: RouteComponent,
  validateSearch: z.record(z.string(), z.coerce.string().trim())
})

const parseQuery = (query: DataSearch): AdminRBACQuery => {
  const roles = query.filters.role?.value || []
  const statuses = query.filters.status?.value || []
  console.log({ query })
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
  return (<div className="page-wrap px-4 pb-8 pt-14">
    <section className="island-shell rounded-2xl p-6 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin / Data Table Demo</h1>
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
    </section>
  </div>)
}
