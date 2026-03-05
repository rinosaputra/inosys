import { Button } from "#/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { ChevronLeft, ChevronsLeft } from "lucide-react"
import type { DataTable } from "./types"

interface DataTablePaginationProps<TData> {
  table: DataTable<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
        Total {table.total} row(s)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.query.pagination.limit}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-17.5">
              <SelectValue placeholder={table.query.pagination.limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {table.query.pagination.index + 1} of{" "}
          {table.pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronLeft className="rotate-180" />
          </Button>
          <Button
            variant="outline"
            className="hidden lg:flex"
            onClick={() => table.setPageIndex(table.pageCount - 1)}
            disabled={!table.canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsLeft className="rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
