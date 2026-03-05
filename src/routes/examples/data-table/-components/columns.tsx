import { Badge } from "@/components/ui/badge"
import type { DataTableColumnDef } from "../../../../components/data/table/types"
import type { UserRow } from "./schema"

const roles: UserRow["role"][] = ["member", "admin", "superadmin"]
const statuses: UserRow["status"][] = ["active", "banned"]

export const userColumns: DataTableColumnDef<UserRow>[] = [
  {
    id: "name",
    label: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    visibility: {},
    searchable: {
      placeholder: "Search by name"
    }
  },
  {
    id: "email",
    label: "Email",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    visibility: {},
  },
  {
    id: "role",
    label: "Role",
    cell: ({ row }) => <Badge variant={row.getValue("role") === "member"
      ? "default"
      : row.getValue("role") === "admin"
        ? "outline"
        : "destructive"
    }>{row.getValue("role")}</Badge>,
    visibility: {},
    filter: {
      label: "Role",
      options: roles.map((role) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role,
      })),
    },
  },
  {
    id: "status",
    label: "Status",
    cell: ({ row }) => <Badge variant={row.getValue("status") === "active" ? "outline" : "destructive"}>{row.getValue("status")}</Badge>,
    visibility: {},
    filter: {
      label: "Status",
      options: statuses.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      })),
    },
  },
  {
    id: "lastSeenAt",
    label: "Last Seen",
    cell: ({ row }) => new Date(row.getValue("lastSeenAt")).toLocaleString(),
    visibility: {},
  },
  {
    id: "createdAt",
    label: "Created",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    visibility: {},
  },
]
