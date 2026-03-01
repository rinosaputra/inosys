import { getSession } from "#/integrations/better-auth/server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: "/login" });
    }
    return { auth: session };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { auth } = Route.useRouteContext();

  return <Outlet />
}
