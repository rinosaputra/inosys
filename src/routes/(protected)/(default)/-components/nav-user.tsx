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
import { memo } from "react"
import { toast } from "sonner"
import { authClient } from "#/lib/auth-client"
import { cn } from "#/lib/utils"

const AvatarUser = memo(({
  user,
  autoHide = false,
}: Auth['Session'] & { autoHide?: boolean }) => {
  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'NN'
  return (<>
    <Avatar className="size-8 rounded-lg">
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
    </Avatar>
    <div className={cn("flex-1 text-left text-sm leading-tight max-w-32", autoHide ? "hidden sm:grid" : "grid")}>
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">{user.email}</span>
    </div>
  </>)
})

function SignOutButton() {
  const handleSignOut = () => {
    toast.promise(authClient.signOut(), {
      loading: "Signing out...",
      success: "Signed out successfully",
      error: "Failed to sign out",
    })
  }
  return (<DropdownMenuItem onClick={handleSignOut}>
    <LogOut />
    Log out
  </DropdownMenuItem>)
}

export function NavUser(props: Auth['Session'] & { autoHide?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          variant={'ghost'}
        >
          <AvatarUser {...props} autoHide />
          <ChevronsUpDown className={cn("ml-auto size-4 hidden sm:inline-block")} />
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
