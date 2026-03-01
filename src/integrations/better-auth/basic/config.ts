import { connection } from "#/lib/connection";
import type { BetterAuthOptions } from "better-auth";
import { createPool } from "mysql2/promise";


export const betterAuthBasicConfig: BetterAuthOptions = {
  database: createPool({
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
    database: connection.database,
    timezone: "Z", // Important to ensure consistent timezone values
  }),
  user: {
    modelName: "_user_lists",
    fields: {
      name: "fullName",
      email: "emailAddress",
    }
  },
  session: {
    modelName: "_user_sessions",
  },
  account: {
    modelName: "_user_accounts",
  },
  verification: {
    modelName: "_user_verifications",
  },
  emailAndPassword: {
    enabled: true,
  }
};
