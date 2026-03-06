import { useState } from "react"
import { RefreshCw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group"
import { Spinner } from "#/components/ui/spinner"
import { useDebounceCallback } from "#/hooks/use-debounce"

import type { DataTable } from "./types"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: DataTable<TData>
}

const DataTableSearchableColumn = <TData,>(table: DataTable<TData>) => {
  const searchableColumn = table.getSearchableColumn()
  const defaultValue = searchableColumn?.column.searchValue as string ?? ""
  const [value, setValue] = useState(() => defaultValue)
  const setSearchValue = searchableColumn?.column.setSearchValue
  const isDenoted = value !== defaultValue

  useDebounceCallback({
    value,
    delay: 500,
    callback: (value) => {
      if (setSearchValue) setSearchValue(value)
      return
    }
  })

  if (!searchableColumn) return null
  return (<InputGroup className="h-8 w-37.5 lg:w-62.5">
    <InputGroupInput
      placeholder={searchableColumn.placeholder}
      value={value}
      onChange={(event) =>
        setValue(event.target.value)
      }
      className="h-8 w-37.5 lg:w-62.5"
      disabled={table.isLoading} />
    <InputGroupAddon>
      <Search />
    </InputGroupAddon>
    {isDenoted && <InputGroupAddon align="inline-end"><Spinner /></InputGroupAddon>}
  </InputGroup>)
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
