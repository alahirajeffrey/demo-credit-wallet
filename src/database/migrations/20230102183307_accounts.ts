import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary(),
      table.bigInteger('balance').defaultTo(0),
      table.string('userEmail').references('email').inTable('users'),
      table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('accounts');
}
