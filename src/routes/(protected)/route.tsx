import { getSession } from "#/integrations/better-auth/server";
import { AUTH_LOGIN_URL } from "#/lib/site";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: AUTH_LOGIN_URL });
    }
    return { auth: session };
  },
  component: () => <Outlet />,
});
