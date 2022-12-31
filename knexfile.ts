import { Knex } from 'knex';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DEV_DB_HOST,
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: process.env.DEV_DB_DATABASE,
      port: Number(process.env.DEV_DB_PORT),
    },
    migrations: {
      directory: __dirname + '/src/database',
    },
    debug: true,
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DEV_PORT),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/src/database',
    },
  },
};

// export default config;
