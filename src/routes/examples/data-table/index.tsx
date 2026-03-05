import { DataTable } from '#/components/data/table/data-table'
import { orpc } from '#/integrations/orpc/client'
import { userColumns } from './-components/columns'
import { roleEnum, statusEnum } from './-components/schema'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import z from 'zod'

export const Route = createFileRoute('/examples/data-table/')({
  component: RouteComponent,
  validateSearch: z.record(z.string(), z.string())
})

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
          const [sortBy, sortOrder] = Object.entries(query.sorts)[0] || ["name", "asc"]
          return orpc.examples.dataTable.findMany.call({
            page: query.pagination.index + 1,
            pageSize: query.pagination.limit,
            search: query.search.name,
            role: roleEnum.array().parse(query.filters.role || []),
            status: statusEnum.array().parse(query.filters.status || []),
            sortBy: sortBy as any,
            sortOrder
          })
        },
        getCount: async (query) => {
          const total = await orpc.examples.dataTable.count.call({
            search: query.search.name,
            role: roleEnum.array().parse(query.filters.role || []),
            status: statusEnum.array().parse(query.filters.status || []),
          })
          return Math.ceil(total / query.pagination.limit)
        },
        getFacets: async () => {
          const facets = await orpc.examples.dataTable.facets.call()
          return facets
        }
      }} />
    </section>
  </div>)
}
