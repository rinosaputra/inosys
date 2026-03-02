import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import SiteHeader from "./-components/site-header";

export const Route = createFileRoute("/(protected)/(default)")({
  component: DefaultLayout
})

function DefaultLayout() {
  return (<div className="[--header-height:calc(--spacing(14))]">
    <SidebarProvider className="flex flex-col">
      <SiteHeader>
        <div className="ml-auto">
          <NavUser user={data.user} />
        </div>
      </SiteHeader>
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>)
}
