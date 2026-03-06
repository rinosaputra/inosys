import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { RefreshCw } from "lucide-react"
import type { DataTable } from "./types"
import { useState } from "react"
import { useDebounceCallback } from "#/hooks/use-debounce"

interface DataTableToolbarProps<TData> {
  table: DataTable<TData>
}

const DataTableSearchableColumn = <TData,>(table: DataTable<TData>) => {
  const searchableColumn = table.getSearchableColumn()
  const defaultValue = searchableColumn?.column.searchValue as string ?? ""
  const [value, setValue] = useState(() => defaultValue)
  const setSearchValue = searchableColumn?.column.setSearchValue

  useDebounceCallback({
    value,
    delay: 500,
    callback: (value) => {
      if (setSearchValue) {
        setSearchValue(value)
      }
    }
  })

  if (!(searchableColumn && setSearchValue)) return null
  return (<Input
    placeholder={searchableColumn.placeholder}
    value={value}
    onChange={(event) =>
      setValue(event.target.value)
    }
    className="h-8 w-37.5 lg:w-62.5"
    disabled={table.isLoading}
  />)
}

const IsFilterActive = <TData,>(table: DataTable<TData>) => {
  if (table.getColumnFilters().length === 0) return null
  return <Button
    variant="ghost"
    onClick={() => table.resetColumnFilters()}
    disabled={table.isLoading}
  >
    Reset
    <RefreshCw />
  </Button>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DataTableSearchableColumn {...table} />
        {table.getFilterableColumns().map(
          (props) =>
            <DataTableFacetedFilter
              disabled={table.isLoading}
              key={props.column.id}
              name={table.name}
              {...props}
            />
        )}
        <IsFilterActive {...table} />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
