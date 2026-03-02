import { SidebarProvider } from "#/components/ui/sidebar";
import { getSession } from "#/integrations/better-auth/server";
import { AUTH_LOGIN_URL } from "#/lib/site";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import SiteHeader from "./-components/site-header";
import { NavUser } from "./-components/nav-user";

export const Route = createFileRoute("/(protected)")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session) {
      throw redirect({ to: AUTH_LOGIN_URL });
    }
    return { auth: session };
  },
  component: ProtectedLayout
});

function ProtectedLayout() {
  const { auth } = Route.useRouteContext();

  return (<div className="[--header-height:calc(--spacing(14))]">
    <SidebarProvider className="flex flex-col">
      <SiteHeader>
        <div className="ml-auto">
          <NavUser {...auth} />
        </div>
      </SiteHeader>
      <Outlet />
    </SidebarProvider>
  </div>)
}
