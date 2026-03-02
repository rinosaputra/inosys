import { memo } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '#/components/ui/sidebar'
import { Link, useLocation } from '@tanstack/react-router'
import { SITE_DESCRIPTION, SITE_TITLE } from '#/lib/site'
import type { NavigationItem } from '#/lib/protected/navigation/types'
import { SIDEBAR_NAVIGATION } from '#/lib/protected/navigation'
import { cn } from '#/lib/utils'

const MenuItem = memo((item: NavigationItem & {
  pathname: string
}) => {
  const isActive = item.pathname.startsWith(item.to)

  if (!item.children) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={item.to}>
                  <i className={cn(item.icon, "h-3 w-4 my-auto")} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup >
    )
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {item.children?.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={item.to}>
                  <i className={cn(item.icon, "h-3 w-4 my-auto")} />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
})

function AppSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {/* @ts-ignore */}
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img src='/logo192.png' className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{SITE_TITLE}</span>
                  <span className="truncate text-xs">{SITE_DESCRIPTION}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_NAVIGATION.map((item, index) => (<MenuItem key={index} {...item} pathname={pathname} />))}
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
