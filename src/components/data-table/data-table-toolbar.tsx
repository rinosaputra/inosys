import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"

export function DataTableToolbar<TData>(props: {
  table: Table<TData>
  searchColumnId: string
  placeholder?: string
}) {
  const { table, searchColumnId, placeholder = "Search..." } = props
  const isFiltered = table.getState().columnFilters.length > 0
  const col = table.getColumn(searchColumnId)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholder}
          value={(col?.getFilterValue() as string) ?? ""}
          onChange={(event) => col?.setFilterValue(event.target.value)}
          className="h-8 w-45 lg:w-70"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 size-4" />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
