import type { DataTableColumnDef } from "#/components/data/table/types";
import { Badge } from "#/components/ui/badge";

import type { AdminRBAC } from "./admin-rbac-schema";

export const adminRBACColumns: DataTableColumnDef<AdminRBAC>[] = [
  {
    id: "name",
    label: "Name",
    cell: ({ row }) => {
      const { name, email } = row.original
      return (<div className="flex flex-col">
        <span>{name}</span>
        <span className="text-sm text-muted-foreground">{email}</span>
      </div>)
    },
    visibility: {},
    searchable: {}
  },
  {
    id: "role",
    label: "Role",
    cell: ({ row }) => {
      const role = row.original.role
      return <Badge variant={role === 'superadmin' ? "destructive" : role === 'admin' ? "outline" : undefined}>
        {role}
      </Badge>
    },
    visibility: {},
  },
  {
    id: "status",
    label: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={status === 'inactive' ? "default" : undefined}>
        {status}
      </Badge>
    },
    visibility: {},
  },
  {
    id: "createdAt",
    label: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return createdAt.toLocaleDateString()
    },
    visibility: {},
  },
  {
    id: "updatedAt",
    label: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt
      return updatedAt.toLocaleDateString()
    },
    visibility: {},
  }
]
