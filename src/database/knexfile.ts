import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DEV_DB_HOST || '127.0.0.1',
      user: process.env.DEV_DB_USER || 'root',
      password: process.env.DEV_DB_PASSWORD || '102296',
      database: process.env.DEV_DB_DATABASE || 'demo-credit-wallet',
    },
    debug: true,
  },

  production: {
    client: 'mysql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};

module.exports = config;
