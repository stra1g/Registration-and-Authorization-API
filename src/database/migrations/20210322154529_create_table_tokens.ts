import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tokens', (table) => {
    table.increments('id')
    table.integer('user_id').references('id').inTable('users')
    table.string('token').unique().notNullable()
    table.timestamp('expires_in').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tokens')
}

