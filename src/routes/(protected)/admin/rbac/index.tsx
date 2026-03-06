import { createFileRoute } from '@tanstack/react-router'

import { DataTable } from '#/components/data/table/data-table'
import type { DataSearch } from '#/components/data/schema'

import z from 'zod'
import { adminRBACColumns } from '#/features/admin/rbac/admin-rbac-columns'
import type { AdminRBACQuery, AdminRBACSelect } from '#/features/admin/rbac/admin-rbac-schema'
import { AdminRBACQuerySchema } from '#/features/admin/rbac/admin-rbac-schema'

export const Route = createFileRoute('/(protected)/admin/rbac/')({
  component: RouteComponent,
  validateSearch: z.record(z.string(), z.coerce.string().trim())
})

const parseQuery = (query: DataSearch): AdminRBACQuery => {
  const [sortBy = undefined, sortOrder = undefined] = Object.entries(query.sorts)[0] || []
  const search = query.search.name || undefined
  const roles = query.filters.role?.value || []
  const statuses = query.filters.status?.value || []
  console.log({ query })
  const result: AdminRBACQuery = {
    searchValue: search,
    searchField: search ? "name" : undefined,
    searchOperator: search ? "contains" : undefined,
    limit: query.pagination.limit,
    offset: query.pagination.index * query.pagination.limit,
    sortBy: sortBy as AdminRBACSelect,
    sortDirection: sortOrder,
    filterField: roles.length > 0 ? "role" : statuses.length > 0 ? "status" : undefined,
    filterValue: roles.length > 0 ? roles.join(",") : statuses.length > 0 ? statuses.join(",") : undefined,
    filterOperator: roles.length > 0 || statuses.length > 0 ? "in" : undefined
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
        getData: async (query) => {
          return orpc.examples.dataTable.findMany.call(parseQuery(query))
        },
        getCount: async (query) => {
          const { search, role, status } = parseQuery(query)
          console.log({
            search,
            role,
            status
          })
          const total = await orpc.examples.dataTable.count.call({
            search,
            role,
            status
          })
          return total
        },
        getFacets: async () => {
          const facets = await orpc.examples.dataTable.facets.call()
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
