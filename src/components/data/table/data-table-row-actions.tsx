
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { Ellipsis, type LucideIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"
import type { DataTableRow } from "./types"


type DataTableCustomActionProps<TData> = {
  label: string
  icon?: LucideIcon
  variant?: "default" | "destructive"
  shortcut?: string
} & ({
  type: "link"
  payload: string
} | {
  type: "action"
  payload: (row: TData) => void
} | {
  type: "custom"
  payload: any
})

const DataTableCustomAction = <TData,>({
  label,
  type,
  payload,
  icon: Icon,
  variant = "default",
  shortcut,
}: DataTableCustomActionProps<TData>) => {
  if (type === "link") {
    return (<DropdownMenuItem variant={variant} asChild>
      <Link to={payload}>
        {Icon && <Icon />}
        {label}
        {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
      </Link>
    </DropdownMenuItem>)
  }
  if (type === "action") {
    // @ts-ignore
    return (<DropdownMenuItem onClick={payload} variant={variant}>
      {Icon && <Icon />}
      {label}
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>)
  }
  return null
}

export interface DataTableRowActionsProps<TData> {
  row: DataTableRow<TData>
  onEdit?(row: TData): void
  onDelete?(row: TData): void
  onView?(row: TData): void
  customActions?: DataTableCustomActionProps<TData>[]
  disabled: boolean
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  onView,
  customActions = [],
  disabled
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted"
          disabled={disabled}
        >
          <Ellipsis />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {onView && <DataTableCustomAction label="View" type="action" payload={() => onView(row.original)} />}
        {onEdit && <DataTableCustomAction label="Edit" type="action" payload={() => onEdit(row.original)} />}
        {(onView || onEdit) && customActions.length > 0 && <DropdownMenuSeparator />}
        {customActions.map((action, index) => (
          <DataTableCustomAction
            key={index}
            {...action} />
        ))}
        {onDelete && (
          <>
            {(onView || onEdit || customActions.length > 0) && <DropdownMenuSeparator />}
            <DataTableCustomAction label="Delete" type="action" payload={() => onDelete(row.original)} variant="destructive" />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
