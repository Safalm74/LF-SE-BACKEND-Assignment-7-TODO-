import { Knex } from "knex";

const TABLE_NAME = "tasks";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          user_id: 1,
          name: "read book",
          is_finished: false,
        },
        {
          user_id: 1,
          name: "Do dishes",
          is_finished: false,
        },
      ]);
    });
}
