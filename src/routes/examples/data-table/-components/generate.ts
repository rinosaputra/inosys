import { faker } from "@faker-js/faker"
import { writeFileSync } from "fs"
import z from "zod"

const userRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["member", "admin", "superadmin"]),
  status: z.enum(["active", "banned"]),
  lastSeenAt: z.iso.datetime(),
  createdAt: z.iso.datetime()
})

type UserRow = z.infer<typeof userRowSchema>



const roles: UserRow["role"][] = ["member", "admin", "superadmin"]
const statuses: UserRow["status"][] = ["active", "banned"]

function makeUserRow(overrides: Partial<UserRow> = {}): UserRow {
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

function makeUserRows(count = 50): UserRow[] {
  return Array.from({ length: count }, () => makeUserRow())
}

// Write the data to a JSON file
try {
  writeFileSync('./.generated/users.json', JSON.stringify({ data: makeUserRows(100) }, null, 2));
  console.log('Successfully wrote fake user data to users.json');
} catch (err) {
  console.error('Error writing file:', err);
}

// you can run: npx ts-node src/routes/examples/data-table/-components/generate.ts
