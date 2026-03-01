import { connection } from "#/lib/connection";

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
