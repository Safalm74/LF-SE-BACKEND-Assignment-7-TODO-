import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  await knex.raw(`TRUNCATE TABLE ${TABLE_NAME} RESTART IDENTITY CASCADE`);
  
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          name: "admin",
          email: "admin@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 1,
        },
        {
          name: "admin2",
          email: "admin2@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 2,
        },
        {
          name: "admin3",
          email: "admin3@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 2,
        },
        {
          name: "admin4",
          email: "admin4@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 2,
        },
        {
          name: "admin5",
          email: "admin5@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 2,
        },
        {
          name: "admin6",
          email: "admin6@admin.com",
          password:
            "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
          role_id: 2,
        },
      ]);
    });
}
