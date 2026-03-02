import z from 'zod'

export const connection = z
  .object({
    host: z.string().nonempty(),
    port: z.number().int().positive(),
    user: z.string().nonempty(),
    password: z.string(),
    database: z.string().nonempty(),
  })
  .parse({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

export type Connection = z.infer<typeof connection>;
