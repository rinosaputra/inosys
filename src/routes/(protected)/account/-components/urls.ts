import { User, type LucideIcon } from "lucide-react"

export const ACCOUNT_URLs: {
  label: string
  description: string
  url: string
  icon: LucideIcon
}[] = [
  {
    label: "Profile",
    description: "Update your name and avatar URL.",
    url: "/account/profile",
    icon: User
  },
  {
    label: "Email",
    description: "Change your email address.",
    url: "/account/email",
    icon: User
  },
  {
    label: "Password",
    description: "Update your password.",
    url: "/account/password",
    icon: User
  },
  {
    label: "Sessions",
    description: "View and manage your active sessions.",
    url: "/account/sessions",
    icon: User
  }
]
