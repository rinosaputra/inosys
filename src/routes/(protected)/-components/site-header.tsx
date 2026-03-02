import { Button } from "#/components/ui/button"
import { Separator } from "#/components/ui/separator"
import { useSidebar } from "#/components/ui/sidebar"
import { SidebarIcon } from "lucide-react"

function SiteHeader({ children }: React.PropsWithChildren) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
          <span className="block sm:hidden">
            Menu
          </span>
        </Button>
        <Separator orientation="vertical" className="mx-2 h-4" />
        {children}
      </div>
    </header>)
}

export default SiteHeader
