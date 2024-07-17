import { IGetUserQuery, IUser } from "../interface/user";
import BaseModel from "./base";

const TABLE_NAME="users";

export class UserModel extends BaseModel{
  static async create(user:IUser,createdById:string){
    const userToCreate={
      name:user.name,
      email:user.email,
      password:user.password,
      role_id:user.role_id,
      created_by:createdById
    }
    await this.queryBuilder().insert(userToCreate).table(TABLE_NAME)
    return user;
  }

  static get(filter:IGetUserQuery){
    const {q:id,page,size}=filter;
    const query=this.queryBuilder().select('id','email','name').table(TABLE_NAME).limit(size!).offset((page! - 1) * size!);

    if (id){
      query.where({id});
    }

    return query;
  }

  static getUserByEmail(email:string){
    const query=this.queryBuilder().select('id','email','name','password','role_id').table(TABLE_NAME).where({email:email})
    return query;
  }

  static async update(id:string,user:IUser){
    const userToUpdate={
      name:user.name,
      email:user.email,
      password:user.password,
      updated_at:new Date()
    }

    const query =this.queryBuilder().update(userToUpdate).table(TABLE_NAME).where({id});
 
    await query;

    return;
  }

  static async delete(UserToDeleteId:string){
    const query=this.queryBuilder().delete().table(TABLE_NAME).where({id:UserToDeleteId});

    await query;
    
    return;
  }
};