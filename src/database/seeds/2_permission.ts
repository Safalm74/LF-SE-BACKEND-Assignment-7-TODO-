import { Knex } from 'knex';

const TABLE_NAME = 'permissions';

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  await knex.raw(`TRUNCATE TABLE ${TABLE_NAME} RESTART IDENTITY CASCADE`);

  return knex(TABLE_NAME)
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          permissions: 'user.post',
        },
        {
          permissions: 'user.get',
        },
        {
          permissions: 'user.put',
        },
        {
          permissions: 'user.delete',
        },
        {
          permissions: 'task.post',
        },
        {
          permissions: 'task.get',
        },
        {
          permissions: 'task.put',
        },
        {
          permissions: 'task.delete',
        },
      ]);
    });
}