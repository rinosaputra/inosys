import { cn } from "#/lib/utils"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { ArrowDown, ChevronsUpDown, EyeClosed } from "lucide-react"
import type { DataTableColumn } from "./types"

interface DataTableColumnHeaderProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: DataTableColumn<TData>
  title: string
  disabled: boolean
}

export function DataTableColumnHeader<TData>({
  column,
  title,
  className,
  disabled
}: DataTableColumnHeaderProps<TData>) {
  if (!column.canSort && !column.canVisible) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            disabled={disabled}
          >
            <span>{title}</span>
            {column.isSorted === "desc" ? (
              <ArrowDown />
            ) : column.isSorted === "asc" ? (
              <ArrowDown className="rotate-180" />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.canSort && (<>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowDown className="text-muted-foreground/70 rotate-180" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
          </>)}
          {column.canVisible && (<>
            {column.canSort && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => column.toggleVisible(false)}>
              <EyeClosed className="text-muted-foreground/70" />
              Hide
            </DropdownMenuItem>
          </>)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
