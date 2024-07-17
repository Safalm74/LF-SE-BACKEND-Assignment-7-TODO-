import { ITask } from "../interface/task";
import BaseModel from "./base";

const TABLE_NAME='tasks'

export class TaskModel extends BaseModel {
  static async create(task: ITask, user_id: string) {
    const taskToCreate = {
      name: task.name,
      is_finished: false,
      user_id: user_id,
      created_by:user_id
    };
    await this.queryBuilder().insert(taskToCreate).table(TABLE_NAME);
    return task;
  }

  static async get(id?: string) {
    const query = this.queryBuilder()
      .select("id", "name", "is_finished")
      .table("tasks")

    if (id) {
      query.where({ user_id: id });
    }

    return query;
  }
  
  static async update(task_id: string, task: ITask, user_id: string) {
    const taskToCreate = {
      name: task.name,
      is_finished: false,
      user_id: user_id,
      updated_at: new Date(),
    };

    const query = this.queryBuilder()
      .update(taskToCreate)
      .table(TABLE_NAME)
      .where({ id: task_id, user_id: user_id });

    await query;
  }

  static async delete(user_id: string, TaskToDeleteId?: string) {
    const query = this.queryBuilder()
      .delete()
      .table(TABLE_NAME)
      .where({ user_id: user_id });
    if (TaskToDeleteId) {
      query.where({ id: TaskToDeleteId });
    }
    await query;
  }
}

