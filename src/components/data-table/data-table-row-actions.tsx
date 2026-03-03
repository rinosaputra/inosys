import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UserRow } from "@/components/data-table/example/schema"

export function DataTableRowActions<TData>({ row }: { row: Row<TData> }) {
  // Untuk demo faker: kita asumsikan row.original sesuai UserRow
  // (kalau nanti kamu pakai row type lain, ganti cast ini atau bikin RowActions yang lebih spesifik)
  const user = row.original as unknown as UserRow

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-45">
        <DropdownMenuItem
          onClick={() => {
            // demo only
            toast.info(`Edit user: ${user.name}`)
          }}
        >
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => copyToClipboard(user.email)}>
          Copy email
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => copyToClipboard(user.id)}>
          Copy ID
          <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            // demo only
            toast.warning(`Delete (demo): ${user.email}`)
          }}
          className="text-destructive focus:text-destructive"
        >
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
