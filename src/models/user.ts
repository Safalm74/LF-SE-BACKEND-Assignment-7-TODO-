import { IGetUserQuery, IUser } from "../interface/user";
import BaseModel from "./base";

export class UserModel extends BaseModel{
  static async create(user:IUser){
    const userToCreate={
      name:user.name,
      email:user.email,
      password:user.password,
      role_id:user.role_id
    }
    await this.queryBuilder().insert(userToCreate).table('users')
    return user;
  }

  static get(filter:IGetUserQuery){
    const {q:id,page,size}=filter;
    const query=this.queryBuilder().select('id','email','name').table("users").limit(size!).offset((page! - 1) * size!);
    if (id){
      query.where({id});
    }
    // const data=await query;
    // const count =await 
    // const meta={
    //   size:data.length
    // }
    return query;
  }

  static getUserByEmail(email:string){
    const query=this.queryBuilder().select('id','email','name','password','role_id').table("users").where({email:email})
    return query;
  }

  static async update(id:string,user:IUser){
    const userToUpdate={
      name:user.name,
      email:user.email,
      password:user.password,
      updated_at:new Date()
    }

    const query =this.queryBuilder().update(userToUpdate).table("users").where({id});

    console.log(await query)
 
    await query;
  }

  static delete(UserToDeleteId:string){
    const query=this.queryBuilder().delete().table("users").where({id:UserToDeleteId});
    return query;
  }
};