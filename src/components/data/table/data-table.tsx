import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar, type DataTableToolbarProps } from "./data-table-toolbar"
import type { DataTable, DataTableColumnDef, DataTableSearch } from "./types"
import _ from "lodash"
import type { UseNavigateResult } from "@tanstack/react-router"
import { toDataSearchSchema, toURLSearchParams } from "../schema"

interface DataTableProps<TData> extends
  DataTableToolbarProps {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  pageCount: number

  // Search
  search: Record<string, string>
  navigate: UseNavigateResult<any>
}

function getDataTable<TData>(props: DataTableProps<TData>, navigate: DataTableSearch): DataTable<TData> {
  return {
    getHeaderGroups: () => [{
      id: "header",
      headers: props.columns.map((column) => ({
        id: column.id,
        column: {
          columnDef: {
            header: column
          },
          getCanSort: () => !column.disableSorting,
          getIsSorted: () => {
            if (column.disableSorting) return false
            return navigate.getQuery().sorts[column.id] || false
          },
          toggleSorting: (desc) => {
            if (column.disableSorting) return
            const currentSorts = navigate.getQuery().sorts ?? []
            const newSorts = { ...currentSorts }
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
          toggleVisibility: (visible) => {
            if (column.disableVisibility) return
            // Implementation for toggling visibility
            const currentViews = navigate.getQuery().views ?? []
            const newViews = { ...currentViews }
            newViews[column.id] = visible === false ? false : true
            navigate.setQuery({ views: newViews })
          }
        },
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
    })
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
      <DataTableToolbar
        {...{ ...props, ...navigate }}
      />
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
                        : flexRender(
                          header.column.columnDef.header,
                          // header.getContext()
                        )}
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
