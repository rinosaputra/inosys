import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/(default)/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(protected)/(default)/dashboard"!</div>
}
