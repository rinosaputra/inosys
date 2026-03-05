import type { DataSearch } from '#/components/data/schema'
import { DataTable } from '#/components/data/table/data-table'
import { orpc } from '#/integrations/orpc/client'
import { userColumns } from './-components/columns'
import { roleEnum, statusEnum, userQuerySchema, type UserQuery } from './-components/schema'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

export const Route = createFileRoute('/examples/data-table/')({
  component: RouteComponent,
  validateSearch: z.record(z.string(), z.coerce.string().trim())
})

const parseQuery = (query: DataSearch): UserQuery => {
  const [sortBy, sortOrder] = Object.entries(query.sorts)[0] || ["name", "asc"]
  const roles = query.filters.role?.value || []
  const statuses = query.filters.status?.value || []
  console.log({ query })
  const result: UserQuery = {
    page: query.pagination.index + 1,
    pageSize: query.pagination.limit,
    search: query.search.name,
    role: roleEnum.array().parse(typeof roles === 'string' ? [roles] : roles) || [],
    status: statusEnum.array().parse(typeof statuses === 'string' ? [statuses] : statuses) || [],
    sortBy: sortBy as any,
    sortOrder
  }
  return userQuerySchema.parse(result)
}

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (<div className="page-wrap px-4 pb-8 pt-14">
    <section className="island-shell rounded-2xl p-6 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin / Data Table Demo</h1>
      <DataTable {...{
        name: "users",
        columns: userColumns,
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
        }
      }} />
    </section>
  </div>)
}
