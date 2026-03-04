import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "#/components/data/table/data-table-column-header"
import type { UserRow } from "./schema"
import type { DataTableColumnDef } from "../types"

const roles: UserRow["role"][] = ["member", "admin", "superadmin"]
const statuses: UserRow["status"][] = ["active", "banned"]

export const userColumns: DataTableColumnDef<UserRow>[] = [
  {
    id: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    id: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
  },
  {
    id: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
    faceted: {
      label: "Role",
      options: roles.map((role) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: role,
      })),
    },
  },
  {
    id: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("status")}</Badge>,
    faceted: {
      label: "Status",
      options: statuses.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      })),
    },
  },
  {
    id: "lastSeenAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Seen" />,
    cell: ({ row }) => new Date(row.getValue("lastSeenAt")).toLocaleString(),
  },
  {
    id: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
]
