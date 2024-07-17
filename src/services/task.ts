import { BadRequestError } from "../error/BadRequestError";
import { NotFoundError } from "../error/NotFoundError";
import { ITask } from "../interface/task";
import * as TaskHandlerModel from "../models/task";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Task Service");

//service to handle create task
export async function createTask(task: ITask, user_id: string) {
  logger.info("Attempting to add task");

  //getting task by name
  const existingTask = (await TaskHandlerModel.TaskModel.get(user_id)).map(
    ({ name: task }) => task
  );

  //to prevent to create repeated task
  if (existingTask.includes(task.name)) {
    logger.warn("Task already exists for the user");

    throw new BadRequestError("Task already exists for the user");
  }

  return TaskHandlerModel.TaskModel.create(task, user_id);
}

//service to handle read task
export function readTasks(user_id: string) {
  return TaskHandlerModel.TaskModel.get(user_id);
}

//service to handle update task
export async function updatedTask(
  id: string,
  updatedTask: ITask,
  user_id: string
) {
  logger.info("Attempting to update task");

  //getting task by name
  const data = (await TaskHandlerModel.TaskModel.get(user_id)).filter(
    ({ id: existingTaskId }) => existingTaskId === id
  )[0];

  if (!data) {
    throw new NotFoundError("Task not found");
  }
  
  //getting task by name
  const existingTask = (await TaskHandlerModel.TaskModel.get(user_id)).map(
    ({ name: task }) => task !== data.name?task:""
  );

  //to prevent to create repeated task
  if (existingTask.includes(updatedTask.name)) {
    logger.warn("Task already exists for the user");

    throw new BadRequestError("Task already exists for the user");
  }

  TaskHandlerModel.TaskModel.update(id, updatedTask, user_id);

  return ` task updated: from (${data.name}) to (${updatedTask.name})`
}

//service to handle delete task
export async function deleteTask(taskId: string, user_id: string) {
  logger.info("Attempting to delete task");

  const data = (await TaskHandlerModel.TaskModel.get(user_id)).filter(
    ({ id: existingTaskId }) => existingTaskId === taskId
  )[0];

  if (!data) {
    throw new NotFoundError("Task not found");
  }

  await TaskHandlerModel.TaskModel.delete(user_id, taskId);

  return ` task deleted: ${data.name}`
}

//service to handle delete task
export function deleteAllTaskByUserId(user_id: string) {
  return TaskHandlerModel.TaskModel.delete(user_id);
}
