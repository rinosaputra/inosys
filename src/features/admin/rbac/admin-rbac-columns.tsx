import type { DataTableColumnDef } from "#/components/data/table/types";
import type { Auth } from "#/lib/auth";

export const adminRBACColumns: DataTableColumnDef<Auth['Session']['user']>[] = [
  {
    id: "name",
    label: "Name",
    cell: ({ row }) => {
      const { name, email } = row.original
      return (<div className="flex flex-col">
        <span>{name}</span>
        <span className="text-sm text-muted-foreground">{email}</span>
      </div>)
    }
  }
]
