
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

type DataTableAction<TData> = (row: TData) => void | string

interface DataTableCustomActionProps<TData> {
  label: string
  onClick: DataTableAction<TData>
  icon?: LucideIcon
  variant?: "default" | "destructive"
  shortcut?: string
}

const DataTableCustomAction = <TData,>({
  label,
  onClick,
  icon: Icon,
  variant = "default",
  shortcut,
}: DataTableCustomActionProps<TData>) => {
  if (typeof onClick === "string") {
    return (<DropdownMenuItem variant={variant} asChild>
      <Link to={onClick}>
        {Icon && <Icon />}
        {label}
        {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
      </Link>
    </DropdownMenuItem>)
  }
  if (typeof onClick === "function") {
    // @ts-ignore
    return (<DropdownMenuItem onClick={onClick} variant={variant}>
      {Icon && <Icon />}
      {label}
      {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>)
  }
  return null
}

interface DataTableRowActionsProps<TData> {
  row: DataTableRow<TData>
  onEdit?: DataTableAction<TData>
  onDelete?: DataTableAction<TData>
  onView?: DataTableAction<TData>
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
        {onView && <DataTableCustomAction label="View" onClick={() => onView(row.original)} />}
        {onEdit && <DataTableCustomAction label="Edit" onClick={() => onEdit(row.original)} />}
        {customActions.length > 0 && <DropdownMenuSeparator />}
        {customActions.map((action, index) => (
          <DataTableCustomAction
            key={index}
            {...action} />
        ))}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DataTableCustomAction label="Delete" onClick={() => onDelete(row.original)} variant="destructive" />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
