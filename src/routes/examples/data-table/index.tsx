import { DataTable } from '#/components/data-table/data-table'
import { userColumns } from '#/components/data-table/example/columns'
import { makeUserRows } from '#/components/data-table/example/schema'
import { useDataTableSearch } from '#/components/data-table/hook'
import { pageInputSchema } from '#/components/data-table/schema'
import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/examples/data-table/')({
  component: RouteComponent,
  validateSearch: pageInputSchema
})

function RouteComponent() {
  const search = Route.useSearch()
  const props = useDataTableSearch(search)
  const { pageSize, page } = props
  const data = React.useMemo(() => makeUserRows(pageSize), [pageSize, page])
  return (<div className="page-wrap px-4 pb-8 pt-14">
    <section className="island-shell rounded-2xl p-6 sm:p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin / Data Table Demo</h1>
      <DataTable columns={userColumns} data={data} searchColumnId='name' />
    </section>
  </div>)
}
