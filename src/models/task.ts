import { ITask } from "../interface/task";
import BaseModel from "./base";
export class TaskModel extends BaseModel {
  static async create(task: ITask, user_id: string) {
    const taskToCreate = {
      name: task.name,
      is_finished: false,
      user_id: user_id,
      created_by:user_id
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

