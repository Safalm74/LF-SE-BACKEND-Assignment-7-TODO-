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
          created_by: 1,
        },
        {
          user_id: 1,
          name: "Do dishes",
          is_finished: false,
          created_by: 1,
        },
        {
          user_id: 1,
          name: "clean room",
          is_finished: false,
          created_by: 1,
        },
        {
          user_id: 1,
          name: "do assignment",
          is_finished: false,
          created_by: 1,
        },
        {
          user_id: 1,
          name: "make proposal",
          is_finished: false,
          created_by: 1,
        },
      ]);
    });
}
