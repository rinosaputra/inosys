import { cn } from "#/lib/utils"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "#/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover"
import { Separator } from "#/components/ui/separator"
import { Check, PlusCircle } from "lucide-react"
import type { DataTableColumn, DataTableFilter, DataTableFnFacet } from "./types"
import { useQuery } from "@tanstack/react-query"

interface DataTableFacetedFilterProps<TData> {
  name: string
  column: DataTableColumn<TData>
  filter: DataTableFilter
  fnFacet: DataTableFnFacet
}

export function DataTableFacetedFilter<TData>({
  name,
  column,
  filter,
  fnFacet

}: DataTableFacetedFilterProps<TData>) {
  // const facets = column?.getFacetedUniqueValues()
  // const selectedValues = new Set(column?.getFilterValue() as string[])
  const selectedValues = column.getFacetedValues()
  const { data: facetData = [], isLoading } = useQuery({
    queryKey: ["data-table", name, "facets", column.id],
    queryFn: async () => {
      const data = await fnFacet()
      return filter.options.map(option => ({
        ...option,
        count: data[option.value] || 0
      }))
    },
    enabled: filter.options.length > 0
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={isLoading}>
          <PlusCircle />
          {filter.label}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  filter.options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={filter.label} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {facetData.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => column.setFacetedValue(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
