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
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
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
