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
  component: () => <div className="flex flex-1 flex-col">
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-auto max-w-full w-4xl">
        <Outlet />
      </div>
    </div>
  </div>,
})
