import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { RefreshCw } from "lucide-react"
import type { DataTableSearch } from "./types"
import { useDebounce } from "#/hooks/use-debounce"

interface DataTableToolbarFilter {
  id: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export interface DataTableToolbarProps {
  searchPlaceholder?: string
  filterableColumns?: DataTableToolbarFilter[]
}

export function DataTableToolbar({
  searchPlaceholder = "Search...",
  filterableColumns = [],
  search,
  setSearch
}: DataTableToolbarProps & DataTableSearch) {
  const isFiltered = !!search.search || Object.keys(search.filters).length > 0
  const onChangeQ = useDebounce((value: string) => {
    setSearch(() => value)
  }, 500)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {search.search && (
          <Input
            placeholder={searchPlaceholder}
            value={search.search.value}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-37.5 lg:w-62.5"
          />
        )}
        {filterableColumns.map(
          (column) =>
            table.getColumn(column.id) && (
              <DataTableFacetedFilter
                key={column.id}
                column={table.getColumn(column.id)}
                title={column.title}
                options={column.options}
              />
            )
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
