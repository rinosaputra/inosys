import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "#/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type { Auth } from "#/lib/auth"
import { Button } from "#/components/ui/button"

function AvatarUser({
  user,
}: Auth['Session']) {
  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'NN'
  return (<Avatar className="size-8 rounded-lg">
    {user.image && <AvatarImage src={user.image} alt={user.name} />}
    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
  </Avatar>)
}

function SignOutButton() {
  return (<DropdownMenuItem>
    <LogOut />
    Log out
  </DropdownMenuItem>)
}

export function NavUser(props: Auth['Session']) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <AvatarUser {...props} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{props.user.name}</span>
            <span className="truncate text-xs">{props.user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <AvatarUser {...props} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{props.user.name}</span>
              <span className="truncate text-xs">{props.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
