import { os } from "@orpc/server"
import { userQuerySchema, type UserQuery, type UserRow } from "./schema"
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const base = os
  .use(async ({ next }) => {
    const db = new Low<{ data: UserRow[] }>(new JSONFile('./.generated/users.json'), {
      data: []
    })
    return next({
      context: {
        users: db
      }
    })
  })

const getFilteredData = (data: UserRow[], input: UserQuery) => {
  let filteredData = data

  if (input.search) {
    const searchLower = input.search.toLowerCase()
    filteredData = filteredData.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  }

  if (input.role && input.role.length > 0) {
    filteredData = filteredData.filter(user => input.role?.includes(user.role))
  }

  if (input.status && input.status.length > 0) {
    filteredData = filteredData.filter(user => input.status?.includes(user.status))
  }

  return filteredData
}

const orpcExampleDataTable = {
  findMany: base
    .input(userQuerySchema)
    .handler(async ({ context, input }) => {
      await context.users.read()
      const data = context.users.data.data || []
      const filteredData = getFilteredData(data, input)

      if (input.sortBy) {
        filteredData.sort((a, b) => {
          const aValue = a[input.sortBy!]
          const bValue = b[input.sortBy!]

          if (aValue < bValue) return input.sortOrder === "asc" ? -1 : 1
          if (aValue > bValue) return input.sortOrder === "asc" ? 1 : -1
          return 0
        })
      }
      return filteredData.slice(
        ((input.page || 1) - 1) * (input.pageSize || 10),
        (input.page || 1) * (input.pageSize || 10)
      )
    }),
  count: base
    .input(userQuerySchema)
    .handler(async ({ context, input }) => {
      await context.users.read()
      const data = context.users.data.data || []
      let filteredData = getFilteredData(data, input)

      return filteredData.length
    }),
  facets: base
    .handler(async ({ context }) => {
      await context.users.read()
      const filteredData = context.users.data.data || []

      const roleFacet: Record<string, number> = {}
      const statusFacet: Record<string, number> = {}

      filteredData.forEach(user => {
        roleFacet[user.role] = (roleFacet[user.role] || 0) + 1
        statusFacet[user.status] = (statusFacet[user.status] || 0) + 1
      })

      return {
        role: roleFacet,
        status: statusFacet
      }
    })
}

export default orpcExampleDataTable
