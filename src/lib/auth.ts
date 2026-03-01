import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

import { connection } from "#/integrations/knex";

export const auth = betterAuth({
  database: createPool({
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
    database: connection.database,
    timezone: "Z", // Important to ensure consistent timezone values
  }),
})
