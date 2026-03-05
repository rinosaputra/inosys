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
import { toDataSearchSchema, toURLSearchParams } from "../schema"
import { DataTableColumnHeader } from "./data-table-column-header"

interface DataTableProps<TData> {
  name: string
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  pageCount: number

  // Search & Navigation from tanstack router
  search: Record<string, string>
  navigate: UseNavigateResult<any>
}

function getDataTable<TData>(props: DataTableProps<TData>, navigate: DataTableSearch): DataTable<TData> {
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
  return {
    name: props.name,
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
      rows: props.data.map((row, index) => ({
        id: String(index),
        original: row,
        getValue: (columnId: string) => _.get(row, columnId),
        getIsSelected: () => false,
        getVisibleCells: () =>
          props.columns.map((column) => ({
            id: `${String(index)}-${column.id}`,
            column: {
              columnDef: {
                cell: row,
              }
            },
          })),
      })),
    }),
    getColumn,
    resetColumnFilters: () => navigate.setQuery({ filters: {} }),
    getFilterableColumns: () => props.columns.filter(col => col.filter && col.fnFacet).map(col => ({
      column: getColumn(col.id)!,
      filter: col.filter!,
      fnFacet: col.fnFacet!
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
    getAllColumns: () => props.columns.map(col => getColumn(col.id)!)
  }
}

function flexRender(content: any) {
  return content
}

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
  const table = getDataTable(props, navigate)


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
                      {flexRender(
                        cell.column.columnDef.cell,
                        // cell.getContext()
                      )}
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
