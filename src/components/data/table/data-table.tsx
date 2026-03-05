import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import type { DataTable, DataTableColumnDef, DataTableRow, DataTableSearch } from "./types"
import _ from "lodash"
import type { UseNavigateResult } from "@tanstack/react-router"
import { toDataSearchSchema, toURLSearchParams, type DataSearch } from "../schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { DataTableRowActions, type DataTableRowActionsProps } from "./data-table-row-actions"

export const getDataTableQueryKey = <T,>(name: T, ...props: unknown[]) => {
  return ["data-table", name, ...props] as const
}

interface DataTableProps<TData> {
  name: string
  columns: DataTableColumnDef<TData>[]
  showRowNumber?: boolean
  rowActions?(row: DataTableRow<TData>): Omit<DataTableRowActionsProps<TData>, "row" | "disabled">


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
      canSort: !!column.sortable,
      isSorted: !column.sortable ? false : navigate.query.sorts[column.id] || false,
      toggleSorting: (desc) => {
        if (!column.sortable) return
        navigate.setQuery({
          sorts: {
            ...navigate.query.sorts,
            [column.id]: typeof desc === "undefined" ? "asc" : desc ? "desc" : "asc"
          }
        })
      },
      canVisible: !!column.visibility,
      isVisible: !column.visibility
        ? false
        : typeof navigate.query.views[column.id] === 'undefined'
          ? true
          : navigate.query.views[column.id],
      toggleVisible: (visible) => {
        if (!column.visibility) return
        const current = navigate.query.views[column.id]
        navigate.setQuery({
          views: {
            ...navigate.query.views,
            [column.id]: typeof visible === 'undefined' ?
              typeof current === 'undefined'
                ? true :
                !current
              : visible
          }
        })
      },
      canFilter: !!column.filter,
      filterValue: !column.filter ? undefined : navigate.query.filters[column.id]?.value,
      setFilterValue: (value, operator = "eq") => {
        if (!column.filter) return
        const newFilters = { ...navigate.query.filters }
        if (!value && newFilters[column.id]) {
          delete newFilters[column.id]
        } else {
          newFilters[column.id] = {
            value: value || "",
            operator
          }
        }
        navigate.setQuery({ filters: newFilters }, { resetPageIndex: true })
      },
      facetedValues: (navigate.query.filters[column.id]?.value
        ? Array.isArray(navigate.query.filters[column.id].value)
          ? navigate.query.filters[column.id].value
          : [navigate.query.filters[column.id].value]
        : []) as string[],
      setFacetedValue: (value) => {
        if (!column.filter) return
        const newFilters = { ...navigate.query.filters }
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
          if (currentValues.length) {
            newFilters[column.id] = {
              value: currentValues,
              operator: "in"
            }
          } else {
            delete newFilters[column.id]
          }
        }
        navigate.setQuery({ filters: newFilters }, { resetPageIndex: true })
      }
    }
  }
  const pageCount = Math.ceil(total / navigate.query.pagination.limit)
  return {
    ...navigate,
    name: props.name,
    isLoading,
    total,
    headerGroups: [{
      id: "header",
      headers: props.columns
        .filter((column) => !!column.visibility && navigate.query.views[column.id] !== false)
        .map((column) => ({
          id: column.id,
          column: getColumn(column.id)!,
          isPlaceholder: false,
          colSpan: 1,
        })),
    }],
    rowModel: {
      rows: data.map((row, index) => ({
        id: String(index),
        original: row,
        getValue: (columnId: string) => _.get(row, columnId),
        isSelected: false,
        visibleCells: props.columns
          .filter((column) => !!column.visibility && navigate.query.views[column.id] !== false)
          .map((column) => ({
            id: `${String(index)}-${column.id}`,
            column: {
              columnDef: column
            },
          })),
      })),
    },
    getColumn,
    resetColumnFilters: () => navigate.setQuery({ filters: {}, search: {} }, { resetPageIndex: true }),
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
    getColumnFilters: () => [
      ...Object.keys(navigate.query.search),
      ...Object.keys(navigate.query.filters)
    ].filter((e, i, a) => a.indexOf(e) === i),
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
    allColumns: props.columns.map(col => getColumn(col.id)!),
    pageCount,
    setPageSize: (size) => {
      navigate.setQuery({
        pagination: {
          ...navigate.query.pagination,
          limit: size,
          index: 0, // reset to first page when page size changes
        }
      })
    },
    setPageIndex: (index) => {
      navigate.setQuery({
        pagination: {
          ...navigate.query.pagination,
          index,
        }
      })
    },
    canPreviousPage: navigate.query.pagination.index > 0,
    previousPage: () => {
      if (navigate.query.pagination.index > 0) {
        navigate.setQuery({
          pagination: {
            ...navigate.query.pagination,
            index: navigate.query.pagination.index - 1,
          }
        })
      }
    },
    canNextPage: navigate.query.pagination.index < pageCount - 1,
    nextPage: () => {
      if (navigate.query.pagination.index < pageCount - 1) {
        navigate.setQuery({
          pagination: {
            ...navigate.query.pagination,
            index: navigate.query.pagination.index + 1,
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
  const query = toDataSearchSchema(props.search)
  const navigate: DataTableSearch = {
    query,
    setQuery(search, options) {
      const values: DataSearch = {
        ...query,
        ...search
      }
      props.navigate({
        // @ts-ignore
        search: toURLSearchParams({
          ...values,
          pagination: options?.resetPageIndex ? {
            ...values.pagination,
            index: 0,
          } : values.pagination
        }),
      })
    }
  }
  const total = useQuery({
    queryKey: getDataTableQueryKey(props.name, "count", {
      search: query.search,
      filters: query.filters
    }),
    queryFn: async () => {
      try {
        const count = await props.getCount(navigate.query)
        return count
      } catch (error) {
        console.error("Error fetching count:", error)
        toast.error("Failed to fetch data count")
        return 0
      }
    },
    refetchOnWindowFocus: false,
  })
  const data = useQuery({
    queryKey: getDataTableQueryKey(props.name, "data", query),
    queryFn: async () => {
      try {
        const data = await props.getData(navigate.query)
        return data
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch data")
        return []
      }
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
      try {
        const facets = await props.getFacets()
        return facets
      } catch (error) {
        console.error("Error fetching facets:", error)
        toast.error("Failed to fetch facets")
        return {}
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!props.getFacets, // Only fetch facets if there are results to show
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
            {table.headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {props.showRowNumber && (
                  <TableHead className="w-12 text-center">#</TableHead>
                )}
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
                {props.rowActions && <TableHead className="w-10" />}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.rowModel.rows?.length ? (
              table.rowModel.rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.isSelected && "selected"}
                >
                  {props.showRowNumber && (
                    <TableCell className="w-12 text-center">
                      {index + 1 + table.query.pagination.index * table.query.pagination.limit}
                    </TableCell>
                  )}
                  {row.visibleCells.map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.cell({ row })}
                    </TableCell>
                  ))}
                  {props.rowActions && (
                    <TableCell className="w-10">
                      <DataTableRowActions
                        {...props.rowActions(row)}
                        row={row}
                        disabled={table.isLoading}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length + (props.showRowNumber ? 1 : 0) + (props.rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
