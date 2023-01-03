import knex from 'knex';
import { config } from './knexfile';
import * as dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);

export const db = knex(config[NODE_ENV]);
