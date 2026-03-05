import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { DataTable, DataTableColumnDef, DataTableSearch } from "./types"
import _ from "lodash"
import type { UseNavigateResult } from "@tanstack/react-router"
import { toDataSearchSchema, toURLSearchParams, type DataSearch } from "../schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { useQuery } from "@tanstack/react-query"

export const getDataTableQueryKey = <T,>(name: T, ...props: unknown[]) => {
  return ["data-table", name, ...props] as const
}

interface DataTableProps<TData> {
  name: string
  columns: DataTableColumnDef<TData>[]

  // function to fetch data based on the current search state
  getData(query: DataSearch): Promise<TData[]>
  getCount(query: DataSearch): Promise<number>
  getFacets?(): Promise<Record<string, Record<string, number>>>

  // Search & Navigation from tanstack router
  search: Record<string, string>
  navigate: UseNavigateResult<any>
}

function getDataTable<TData>({
  navigate,
  props,
  isLoading,
  total,
  data,
  fasets
}: {
  props: DataTableProps<TData>,
  navigate: DataTableSearch
  isLoading: boolean
  total: number
  data: TData[]
  fasets: Record<string, Record<string, number>>
}): DataTable<TData> {
  const getColumn: DataTable<TData>["getColumn"] = (columnId) => {
    const column = props.columns.find((col) => col.id === columnId)
    if (!column) return undefined
    return {
      id: column.id,
      columnDef: {
        header: column
      },
      getCanSort: () => !!column.sortable,
      getIsSorted: () => {
        if (!column.sortable) return false
        return navigate.getQuery().sorts[column.id] || false
      },
      toggleSorting: (desc) => {
        if (!column.sortable) return
        const newSorts = { ...navigate.getQuery().sorts }
        if (typeof desc === "undefined") {
          if (!newSorts[column.id]) {
            newSorts[column.id] = "asc"
          } else {
            newSorts[column.id] = newSorts[column.id] === "asc" ? "desc" : "asc"
          }
        } else {
          newSorts[column.id] = desc ? "desc" : "asc"
        }
        navigate.setQuery({ sorts: newSorts })
      },
      getIsVisible: () => {
        if (!column.visibility) return true
        return navigate.getQuery().views[column.id] !== false
      },
      getCanHide: () => !!column.visibility,
      toggleVisibility: (visible) => {
        if (!column.visibility) return
        // Implementation for toggling visibility
        const newViews = { ...navigate.getQuery().views }
        newViews[column.id] = visible === false ? false : true
        navigate.setQuery({ views: newViews })
      },
      getCanFilter: () => !!column.filter,
      getFilterValue: () => {
        if (!column.filter) return undefined
        return navigate.getQuery().filters[column.id]?.value
      },
      setFilterValue: (value, operator = "eq") => {
        if (!column.filter) return
        const newFilters = { ...navigate.getQuery().filters }
        if (!value && newFilters[column.id]) {
          delete newFilters[column.id]
        } else {
          newFilters[column.id] = {
            value: value || "",
            operator
          }
        }
        navigate.setQuery({ filters: newFilters })
      },
      getFacetedValues: () => {
        const newFilters = { ...navigate.getQuery().filters }
        const filterValue = newFilters[column.id]?.value || ''
        return (Array.isArray(filterValue) ? filterValue : [filterValue]).filter(Boolean)
      },
      setFacetedValue: (value) => {
        if (!column.filter) return
        const newFilters = { ...navigate.getQuery().filters }
        if (!newFilters[column.id]) {
          newFilters[column.id] = {
            value: [value],
            operator: 'in'
          }
        } else {
          const currentValues = (
            Array.isArray(newFilters[column.id].value)
              ? newFilters[column.id].value
              : [newFilters[column.id].value]
          ) as string[]
          const existingIndex = currentValues.indexOf(value)
          if (existingIndex > -1) {
            currentValues.splice(existingIndex, 1)
          } else {
            currentValues.push(value)
          }
          newFilters[column.id] = {
            value: currentValues,
            operator: "in"
          }
        }
        navigate.setQuery({ filters: newFilters })
      }
    }
  }
  const getPageCount = () => {
    const limit = navigate.getQuery().pagination.limit
    return Math.ceil(total / limit)
  }
  return {
    ...navigate,
    name: props.name,
    isLoading,
    getHeaderGroups: () => [{
      id: "header",
      headers: props.columns.map((column) => ({
        id: column.id,
        column: getColumn(column.id)!,
        isPlaceholder: false,
        colSpan: 1,
      })),
    }],
    getRowModel: () => ({
      rows: data.map((row, index) => ({
        id: String(index),
        original: row,
        getValue: (columnId: string) => _.get(row, columnId),
        getIsSelected: () => false,
        getVisibleCells: () =>
          props.columns.map((column) => ({
            id: `${String(index)}-${column.id}`,
            column: {
              columnDef: column
            },
          })),
      })),
    }),
    getColumn,
    resetColumnFilters: () => navigate.setQuery({ filters: {} }),
    getFilterableColumns: () => props.columns.filter(col => col.filter).map(col => ({
      column: getColumn(col.id)!,
      filter: {
        ...col.filter!,
        options: col.filter!.options.map(option => ({
          ...option,
          count: fasets[col.id]?.[option.value] || 0
        }))
      },
    })),
    getColumnFilters: () => Object.keys(navigate.getQuery().filters),
    getSearchableColumn: (name) => {
      const columns = props.columns.filter(col => col.searchable)
      if (!columns.length) return undefined
      const column = name ? columns.find(col => col.id === name) : columns[0]
      if (!column) return undefined
      return {
        column: getColumn(column.id)!,
        placeholder: column.searchable?.placeholder || `Search ${column.label}...`
      }
    },
    getAllColumns: () => props.columns.map(col => getColumn(col.id)!),
    getPageCount,
    setPageSize: (size) => {
      navigate.setQuery({
        pagination: {
          ...navigate.getQuery().pagination,
          limit: size,
          index: 0, // reset to first page when page size changes
        }
      })
    },
    setPageIndex: (index) => {
      navigate.setQuery({
        pagination: {
          ...navigate.getQuery().pagination,
          index,
        }
      })
    },
    getCanPreviousPage: () => navigate.getQuery().pagination.index > 0,
    previousPage: () => {
      if (navigate.getQuery().pagination.index > 0) {
        navigate.setQuery({
          pagination: {
            ...navigate.getQuery().pagination,
            index: navigate.getQuery().pagination.index - 1,
          }
        })
      }
    },
    getCanNextPage: () => {
      const pageCount = getPageCount()
      return navigate.getQuery().pagination.index < pageCount - 1
    },
    nextPage: () => {
      const pageCount = getPageCount()
      if (navigate.getQuery().pagination.index < pageCount - 1) {
        navigate.setQuery({
          pagination: {
            ...navigate.getQuery().pagination,
            index: navigate.getQuery().pagination.index + 1,
          }
        })
      }
    }
  }
}

// function flexRender(content: any) {
//   return content
// }

export function DataTable<TData>(props: DataTableProps<TData>) {
  const navigate: DataTableSearch = {
    getQuery() {
      return toDataSearchSchema(props.search)
    },
    setQuery(search) {
      props.navigate({
        // @ts-ignore
        search: toURLSearchParams({
          ...props.search,
          ...search
        })
      })
    }
  }
  const total = useQuery({
    queryKey: getDataTableQueryKey(props.name, "count", props.search),
    queryFn: async () => {
      const count = await props.getCount(navigate.getQuery())
      return count
    },
    refetchOnWindowFocus: false,
  })
  const data = useQuery({
    queryKey: getDataTableQueryKey(props.name, "data", props.search),
    queryFn: async () => {
      const data = await props.getData(navigate.getQuery())
      return data
    },
    // keepPreviousData: true,
    // Refetch data when filters or sorting change
    refetchOnWindowFocus: false,
    enabled: total.data !== 0, // Only fetch data if there are results to show
  })
  const facets = useQuery({
    queryKey: getDataTableQueryKey(props.name, "facets"),
    queryFn: async () => {
      if (!props.getFacets) return {}
      const facets = await props.getFacets()
      return facets
    },
    refetchOnWindowFocus: false,
    enabled: total.data !== 0 && !!props.getFacets, // Only fetch facets if there are results to show
  })
  const table = getDataTable({
    props,
    navigate,
    isLoading: total.isLoading || data.isLoading || facets.isLoading,
    total: total.data ?? 0,
    data: data.data ?? [],
    fasets: facets.data ?? {}
  })


  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : <DataTableColumnHeader
                          column={header.column}
                          title={header.column.columnDef.header.label}
                          disabled={table.isLoading}
                        />}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell({ row })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <DataTablePagination table={table} /> */}
    </div>
  )
}
