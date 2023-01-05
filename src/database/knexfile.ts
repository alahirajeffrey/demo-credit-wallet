import { Knex } from 'knex';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '102296',
      database: 'demo-credit-wallet',
    },
    debug: true,
  },

  production: {
    client: 'mysql',
    connection: {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASWWORD,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT),
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      // directory: './migrations',
    },
  },
};

module.exports = config;
