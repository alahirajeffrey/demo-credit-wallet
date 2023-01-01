import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary(),
      table.string('recieverId'),
      table.float('amount'),
      table
        .enum('transactionType', ['transfer', 'withdrawal'])
        .defaultTo('withdrawal'),
      table.boolean('isTransactionSuccessful'),
      table.string('accountId').references('id').inTable('accounts'),
      table.timestamp('transactionTime').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transactions');
}
