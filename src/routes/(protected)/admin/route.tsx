import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '#/integrations/better-auth/server';
import { UNAUTHORIZED_URL } from '#/lib/site';

export const Route = createFileRoute('/(protected)/admin')({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: UNAUTHORIZED_URL });
    }
    return { auth: session };
  },
  component: () => <Outlet />,
})
