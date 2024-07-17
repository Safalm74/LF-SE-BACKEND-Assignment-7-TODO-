import { ITask } from "../interface/task";
import loggerWithNameSpace from "../utils/logger";
import BaseModel from "./base";
export class TaskModel extends BaseModel {
  static async create(task: ITask, user_id: string) {
    const taskToCreate = {
      name: task.name,
      is_finished: false,
      user_id: user_id,
    };
    await this.queryBuilder().insert(taskToCreate).table("tasks");
    return task;
  }

  static async get(id?: string) {
    const size = 20;
    const page = 1;
    const query = this.queryBuilder()
      .select("id", "name", "is_finished")
      .table("tasks")
      .limit(size!)
      .offset((page! - 1) * size!);

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
      .table("tasks")
      .where({ id: task_id, user_id: user_id });

    await query;
  }

  static async delete(user_id: string, TaskToDeleteId?: string) {
    const query = this.queryBuilder()
      .delete()
      .table("tasks")
      .where({ user_id: user_id });
    if (TaskToDeleteId) {
      query.where({ id: TaskToDeleteId });
    }
    await query;
  }

  // static get(filter:IGetUserQuery){
  //   const {q:id,page,size}=filter;
  //   const query=this.queryBuilder().select('id','email','name').table("users").limit(size!).offset((page! - 1) * size!);
  //   if (id){
  //     query.where({id});
  //   }
  //   // const data=await query;
  //   // const count =await
  //   // const meta={
  //   //   size:data.length
  //   // }
  //   return query;
  // }

  // static getUserByEmail(email:string){
  //   const query=this.queryBuilder().select('id','email','name','password','role_id').table("users").where({email:email})
  //   return query;
  // }

  // static async update(id:string,user:IUser){
  //   const userToUpdate={
  //     name:user.name,
  //     email:user.email,
  //     password:user.password,
  //     updated_at:new Date()
  //   }

  //   const query =this.queryBuilder().update(userToUpdate).table("users").where({id});

  //   console.log(await query)

  //   await query;
  // }

  // static delete(UserToDeleteId:string){
  // }
}

const logger = loggerWithNameSpace("User Model");

//Array for storing tasks
let tasks: ITask[] = [];

//function to check if task exists on tasks array
function checkOnTasks(id: string, user_id: string) {
  return tasks.find(({ id: taskId }) => {
    return taskId === id;
  });
}

//function to add task on array (create)
export function createTask(task: ITask, user_id: string) {
  //getting new id by increasing latest id by 1
  const newTaskId =
    tasks.length === 0 ? "1" : `${+tasks[tasks.length - 1].id + 1}`;

  //initializing is_finished flag as false
  const initialFinishFlag = false;

  //creating task obj
  const newTask: ITask = {
    ...task,
    id: newTaskId,
    is_finished: initialFinishFlag,
    user_id: user_id,
  };

  //pushing the obj to task to tasks array
  tasks.push(newTask);

  logger.info("Task Created");

  return `Task Created: ${task.name}`;
}

//reading all task function
export function readTasks(user_id: string) {
  return tasks.filter((obj) => {
    return obj.user_id === user_id;
  });
}

export function getTaskByName(user_id: string, task_name: string) {
  return tasks.find(({ user_id: userId, name }) => {
    return userId === user_id && task_name === name;
  });
}

export function getTaskById(user_id: string, task_id: string) {
  return tasks.find(({ user_id: userId, id: taskId }) => {
    return userId === user_id && taskId === task_id;
  });
}

//reading remaining task
export function readRemainingTasks(user_id: string) {
  const taskRemaining = tasks.filter((task) => {
    return !task.is_finished;
  });

  return taskRemaining;
}

//reading finished task
export function readFinishedTasks(user_id: string) {
  const taskFinished = tasks.filter((task) => {
    return task.is_finished;
  });

  return taskFinished;
}

//change task constained on tasks array
export function updateTask(id: string, updatedTask: ITask, user_id: string) {
  //calling function to return obj with the id
  const update_obj = checkOnTasks(id, user_id);

  const temp = update_obj!.name;
  const newUpdatedTask = {
    ...updatedTask,
    id: id,
    user_id: user_id,
  };

  //replacing the obj with updated obj
  Object.assign(update_obj!, newUpdatedTask);

  logger.info("Task Updated");

  return ` task updated: from (${temp}) to (${update_obj!.name})`;
}

//delete task from task array
export function deleteTask(id: string, user_id: string) {
  //calling function to return obj with the id
  const delete_obj = checkOnTasks(id, user_id);

  tasks = tasks.filter(({ id: taskId }) => {
    return !(taskId === id);
  });

  logger.info("Task Deleted");

  return ` task deleted: ${delete_obj!.name}`;
}

//delete task from task array
export function deleteAllTaskByUserId(user_id: string) {
  //calling function to return obj with the id

  tasks = tasks.filter(({ user_id: taskId }) => {
    return !(taskId === user_id);
  });

  logger.info("Tasks Deleted for user: ", user_id);

  return `Tasks Deleted for user: ${user_id}`;
}
