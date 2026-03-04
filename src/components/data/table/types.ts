import type { LucideIcon } from "lucide-react"
import type { DataSearch } from "../schema"

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
      columnDef: {
        cell: TData
      }
    }
  }[]
}

export interface DataTableFaceted {
  label: string
  options: {
    label: string
    value: string
    icon?: LucideIcon
  }[]
}

export interface DataTableColumnDef<TData> {
  id: string
  header?: (props: { column: DataTableColumn<TData> }) => React.ReactNode
  cell: (props: { row: DataTableRow<TData> }) => React.ReactNode
  children?: DataTableColumnDef<TData>[]
  disableSorting?: boolean
  disableVisibility?: boolean
  faceted?: DataTableFaceted
}

export interface DataTableColumn<TData> {
  columnDef: {
    header: DataTableColumnDef<TData>
  },
  getCanSort(): boolean
  getIsSorted(): "asc" | "desc" | false
  toggleSorting(desc?: boolean): void
  toggleVisibility(visible?: boolean): void
}

export type DataTable<TData> = {
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
}
