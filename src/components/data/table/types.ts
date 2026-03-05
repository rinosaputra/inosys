import type { LucideIcon } from "lucide-react"
import type { DataSearch, DataTableOperator } from "../schema"

export interface DataTableSearch {
  getQuery(): DataSearch
  setQuery(search: Partial<DataSearch>): void
}

export interface DataTableRow<TData> {
  id: string
  original: TData
  getValue(columnId?: string): any
  getIsSelected(): boolean
  getVisibleCells(): {
    id: string
    column: {
      columnDef: DataTableColumnDef<TData>
    }
  }[]
}

export interface DataTableFilter {
  label: string
  options: {
    label: string
    value: string
    icon?: LucideIcon
  }[]
}

export type DataTableFnFacet = () => Promise<Record<string, number>>

export interface DataTableColumnDef<TData> {
  id: string
  label: string
  header?: (props: { column: DataTableColumn<TData> }) => React.ReactNode
  cell: (props: { row: DataTableRow<TData> }) => React.ReactNode
  children?: DataTableColumnDef<TData>[]
  sortable?: {
    defaultSort?: "asc" | "desc"
  }
  visibility?: {
    defaultVisible?: boolean
  }
  searchable?: {
    placeholder?: string
  }
  filter?: DataTableFilter
  fnFacet?: DataTableFnFacet
}

export interface DataTableColumn<TData> {
  id: string
  columnDef: {
    header: DataTableColumnDef<TData>
  },
  getCanSort(): boolean
  getIsSorted(): "asc" | "desc" | false
  toggleSorting(desc?: boolean): void
  getCanHide(): boolean
  getIsVisible(): boolean
  toggleVisibility(visible?: boolean): void
  getCanFilter(): boolean
  getFilterValue(): string | string[] | undefined
  setFilterValue(value: string | string[] | undefined, operator?: DataTableOperator): void
  getFacetedValues(): string[]
  setFacetedValue(value: string): void
}

export type DataTable<TData> = DataTableSearch & {
  name: string
  isLoading: boolean
  getHeaderGroups: () => {
    id: string
    headers: {
      id: string
      column: DataTableColumn<TData>
      isPlaceholder: boolean
      colSpan: number
    }[]
  }[]
  getRowModel: () => {
    rows: DataTableRow<TData>[]
  }
  getColumn(columnId: string): DataTableColumn<TData> | undefined
  resetColumnFilters(): void
  getFilterableColumns(): {
    column: DataTableColumn<TData>
    filter: DataTableFilter
    fnFacet: DataTableFnFacet
  }[]
  getColumnFilters(): string[]
  getSearchableColumn(name?: string): {
    column: DataTableColumn<TData>
    placeholder: string
  } | undefined
  getAllColumns(): DataTableColumn<TData>[]
  // pagination
  getPageCount(): number
  setPageSize(size: number): void
  setPageIndex(index: number): void
  getCanPreviousPage(): boolean
  previousPage(): void
  getCanNextPage(): boolean
  nextPage(): void
}
