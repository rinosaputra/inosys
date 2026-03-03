import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Cog,
  LogOut,
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
import { Link, useRouter } from "@tanstack/react-router"
import { ACCOUNT_URL, AUTH_LOGIN_URL, NOTIFICATIONS_URL, SETTINGS_URL } from "#/lib/site"

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
  const router = useRouter()
  const handleSignOut = () => {
    toast.promise(authClient.signOut(), {
      loading: "Signing out...",
      success: () => {
        router.navigate({ to: AUTH_LOGIN_URL })
        return "Signed out successfully"
      },
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
          <DropdownMenuItem asChild>
            <Link to={ACCOUNT_URL}>
              <BadgeCheck />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={SETTINGS_URL}>
              <Cog />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={NOTIFICATIONS_URL}>
              <Bell />
              Notifications
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
