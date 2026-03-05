import z from "zod"
import _ from 'lodash'

const nonEmptyString = z
  .coerce
  .string()
  .trim()
  .transform((v) => v)

const dataTableOperators = z.enum(["eq", "ne", "gt", "lt", "gte", "lte", "in", "nin"])

export type DataTableOperator = z.infer<typeof dataTableOperators>

/**
 * General-purpose Data search schema.
 * - URL-friendly
 * - Works well with TanStack Router validateSearch
 * - Suitable for server-side tables (oRPC) and manual TanStack Table state
 */
export const dataSearchSchema = z.object({
  // pagination (1-based index, UX friendly)
  pagination: z
    .object({
      index: z.coerce.number().int().min(0).default(0),
      limit: z.coerce.number().int().min(10).default(100),
    })
    .catch({
      index: 0,
      limit: 10,
    }),

  // optional: column-specific search (override q semantics if you want)
  search: z.record(nonEmptyString, nonEmptyString).catch({}),

  // sorting (optional & clean)
  sorts: z.record(nonEmptyString, z.enum(["asc", "desc"])).catch({}),

  // filters (optional & flexible)
  // - value can be string or array for multi-value filters (e.g. multi-select)
  filters: z.record(nonEmptyString, z.object({
    value: z.union([nonEmptyString, z.array(nonEmptyString)]),
    operator: dataTableOperators.default("eq"),
  })).catch({}),

  // views (optional, for saving column visibility or other UI state)
  views: z.record(nonEmptyString, z.coerce.boolean().default(true)).catch({}),
})

export type DataSearch = z.infer<typeof dataSearchSchema>

export function toOffset(input: DataSearch['pagination']) {
  return input.index * input.limit
}

export function toDataSearchSchema(input: Record<string, string>): DataSearch {
  const defaultSearch: DataSearch = {
    pagination: {
      index: 0,
      limit: 10,
    },
    search: {},
    sorts: {},
    filters: {},
    views: {},
  }
  const data = Object.entries(input).reduce((acc, [key, value]) => {
    acc = _.set(acc, key, value)
    return acc
  }, { ...defaultSearch })
  const parse = dataSearchSchema.safeParse(data)
  return parse.data || defaultSearch
}

export function toURLSearchParams(search: DataSearch) {
  const params: [string, string][] = []

  // pagination
  params.push(['pagination.index', String(search.pagination.index)])
  params.push(['pagination.limit', String(search.pagination.limit)])

  // search
  if (search.search && search.search.key && search.search.value) {
    params.push(['search.key', search.search.key])
    params.push(['search.value', search.search.value])
  }

  // views
  Object.entries(search.views).forEach(([key, value]) => {
    params.push([`views.${key}`, String(value)])
  })

  // sorts
  Object.entries(search.sorts).forEach(([key, dir]) => {
    params.push([`sorts.${key}`, dir])
  })

  // filters
  Object.entries(search.filters).forEach(([key, { value, operator }]) => {
    params.push([`filters.${key}.value`, String(value)])
    params.push([`filters.${key}.operator`, operator])
  })

  return Object.fromEntries(params)
}

export const dataFacetSchema = z.record(nonEmptyString, z.number().int().min(0))

export type DataFacet = z.infer<typeof dataFacetSchema>
