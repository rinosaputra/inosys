import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/rpc/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/api/rpc/$"!</div>
}
