import type { LucideIcon } from "lucide-react"
import type { DataSearch, DataTableOperator } from "../schema"

export interface DataTableSearch {
  query: DataSearch
  setQuery(search: Partial<DataSearch>, options?: {
    resetPageIndex?: boolean
  }): void
}

export interface DataTableRow<TData> {
  id: string
  original: TData
  getValue(columnId?: string): any
  isSelected: boolean
  visibleCells: {
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
    count?: number
  }[]
}

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
}

export interface DataTableColumn<TData> {
  id: string
  columnDef: {
    header: DataTableColumnDef<TData>
  },
  canSort: boolean
  isSorted: "asc" | "desc" | false
  toggleSorting(desc?: boolean): void
  canVisible: boolean
  isVisible: boolean
  toggleVisible(visible?: boolean): void
  canFilter: boolean
  filterValue: string | string[] | undefined
  setFilterValue(value: string | string[] | undefined, operator?: DataTableOperator): void
  facetedValues: string[]
  setFacetedValue(value: string): void
}

export type DataTable<TData> = DataTableSearch & {
  name: string
  isLoading: boolean
  total: number
  headerGroups: {
    id: string
    headers: {
      id: string
      column: DataTableColumn<TData>
      isPlaceholder: boolean
      colSpan: number
    }[]
  }[]
  rowModel: {
    rows: DataTableRow<TData>[]
  }
  getColumn(columnId: string): DataTableColumn<TData> | undefined
  resetColumnFilters(): void
  getFilterableColumns(): {
    column: DataTableColumn<TData>
    filter: DataTableFilter
  }[]
  getColumnFilters(): string[]
  getSearchableColumn(name?: string): {
    column: DataTableColumn<TData>
    placeholder: string
  } | undefined
  allColumns: DataTableColumn<TData>[]
  // pagination
  pageCount: number
  setPageSize(size: number): void
  setPageIndex(index: number): void
  canPreviousPage: boolean
  previousPage(): void
  canNextPage: boolean
  nextPage(): void
}
