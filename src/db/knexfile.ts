import { Knex } from 'knex';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: process.env.DB_CLIENT || 'better-sqlite3',
  connection: {
    filename: process.env.DB_FILENAME || path.resolve(process.cwd(), 'src/db/database.sqlite'),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(process.cwd(), 'src/db/migrations')
  },
  seeds: {
    directory: path.resolve(process.cwd(), 'src/db/seeds')
  }
};

export default config;
