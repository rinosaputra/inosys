import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { adminRBACUrls } from '#/features/admin/rbac/admin-rbac-const';
import { adminRBACGetUserById } from '#/features/admin/rbac/admin-rbac-server';

export const Route = createFileRoute('/(protected)/admin/rbac/$id')({
  component: RouteComponent,
  beforeLoad: async ({ params: { id }, context }) => {
    const data = await adminRBACGetUserById({ data: { id } });

    if (!data) {
      redirect({ to: adminRBACUrls.list })
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
