import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary(),
      table
        .enum('transactionType', ['transfer', 'withdrawal', 'funding'])
        .defaultTo('withdrawal'),
      table.float('amount'),
      table.string('recieverEmail'),
      table.boolean('isTransactionSuccessful'),
      table.string('accountEmail').references('userEmail').inTable('accounts'),
      table.timestamp('transactionTime').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {}
