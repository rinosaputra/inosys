import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { RefreshCw } from "lucide-react"
import type { DataTable } from "./types"

interface DataTableToolbarProps<TData> {
  table: DataTable<TData>
  // searchKey?: string
  // searchPlaceholder?: string
  // filterableColumns?: {
  //   id: string
  //   title: string
  //   options: {
  //     label: string
  //     value: string
  //     icon?: React.ComponentType<{ className?: string }>
  //   }[]
  // }[]
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getColumnFilters().length > 0
  const searchableColumn = table.getSearchableColumn()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumn && (
          <Input
            placeholder={searchableColumn.placeholder}
            value={
              (searchableColumn.column.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              searchableColumn.column.setFilterValue(event.target.value)
            }
            className="h-8 w-37.5 lg:w-62.5"
          />
        )}
        {table.getFilterableColumns().map(
          (props) =>
            <DataTableFacetedFilter
              key={props.column.id}
              name={table.name}
              {...props}
            />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <RefreshCw />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
