import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/admin/rbac/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(protected)/admin/rbac/"!</div>
}
