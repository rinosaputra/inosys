import z from "zod";

export const connection = z
  .object({
    host: z.string().nonempty(),
    port: z.number().int().positive(),
    user: z.string().nonempty(),
    password: z.string(),
    database: z.string().nonempty(),
  })
  .parse({
    host: import.meta.env.DB_HOST,
    port: Number(import.meta.env.DB_PORT),
    user: import.meta.env.DB_USER,
    password: import.meta.env.DB_PASSWORD,
    database: import.meta.env.DB_NAME,
  });

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: connection.host,
    port: connection.port,
    user: connection.user,
    password: connection.password,
    database: connection.database,
  },
  pool: { min: 0, max: 7 },
});

export default knex;
