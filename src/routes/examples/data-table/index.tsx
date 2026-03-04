import { DataTable } from '#/components/data/table/data-table'
import { userColumns } from '#/components/data/table/example/columns'
import { makeUserRows } from '#/components/data/table/example/schema'
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
  const data = React.useMemo(() => {
    const size = parseInt(search['page.size'])
    return makeUserRows(isNaN(size) ? 10 : size)
  }, [Route.fullPath])
  return (<div className="page-wrap px-4 pb-8 pt-14">
    <section className="island-shell rounded-2xl p-6 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin / Data Table Demo</h1>
      <DataTable {...{
        columns: userColumns,
        data,
        fullPath: Route.fullPath,
        navigate,
        search,
        pageCount: 100, // for demo purposes only (server-side pagination)
        filterableColumns: [],
        searchPlaceholder: "Search users...",
      }} />
    </section>
  </div>)
}
