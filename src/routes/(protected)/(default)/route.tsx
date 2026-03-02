import { SidebarInset } from "#/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppSidebar from "./-components/app-sidebar";

export const Route = createFileRoute("/(protected)/(default)")({
  component: DefaultLayout,
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
      }
    ]
  })
})

function DefaultLayout() {
  return (<div className="flex flex-1">
    <AppSidebar />
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Outlet />
      </div>
    </SidebarInset>
  </div>)
}
