import 'dotenv/config';
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
