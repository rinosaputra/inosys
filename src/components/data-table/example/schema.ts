// src/components/data-table/example/schema.ts
import { faker } from "@faker-js/faker"
import z from "zod"

export const userRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["member", "admin", "superadmin"]),
  status: z.enum(["active", "banned"]),
  lastSeenAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type UserRow = z.infer<typeof userRowSchema>

const roles: UserRow["role"][] = ["member", "admin", "superadmin"]
const statuses: UserRow["status"][] = ["active", "banned"]

export function makeUserRow(overrides: Partial<UserRow> = {}): UserRow {
  const row: UserRow = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email({ allowSpecialCharacters: false }).toLowerCase(),
    role: faker.helpers.arrayElement(roles),
    status: faker.helpers.arrayElement(statuses),
    lastSeenAt: faker.date
      .recent({ days: 14 })
      .toISOString(),
    createdAt: faker.date
      .past({ years: 2 })
      .toISOString(),
    ...overrides,
  }

  // validate supaya data dummy tetap sesuai schema (berguna saat dev)
  return userRowSchema.parse(row)
}

export function makeUserRows(count = 50): UserRow[] {
  return Array.from({ length: count }, () => makeUserRow())
}
