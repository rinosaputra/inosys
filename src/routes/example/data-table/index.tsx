import { useDataTableSearch } from '#/components/data-table/hook'
import { pageInputSchema } from '#/components/data-table/schema'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/example/data-table/')({
  component: RouteComponent,
  validateSearch: pageInputSchema
})

function RouteComponent() {
  const search = Route.useSearch()
  const props = useDataTableSearch(search)
  return <div>{
    JSON.stringify(props, null, 2)
  }</div>
}
