import { authClient } from '#/lib/auth-client';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/admin/rbac/$id')({
  component: RouteComponent,
  beforeLoad: async ({ params: { id }, context }) => {
    const { data, error } = await authClient.admin.getUser({
      query: {
        id
      },
    });
    if (error) {
      throw new Response(error.message, { status: error.status || 500 });
    }
    return {
      ...context,
      user: data,
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
