import * as UserModel from "../models/user";
import { IGetUserQuery, IUser } from "../interface/user";
import bcrypt from "bcrypt";
import { NotFoundError } from "../error/NotFoundError";
import loggerWithNameSpace from "../utils/logger";
import { BadRequestError } from "../error/BadRequestError";
import { deleteAllTaskByUserId } from "./task";
import { func } from "joi";
import knex, { Knex } from "knex";

const logger = loggerWithNameSpace("User Service");

//service function to return user by id
export async function getUserById(id: string) {
  logger.info("Attempting to get user by id");
  
  const existingUser=await UserModel.UserModel.get({ q: id, page: 1, size: 1 });
  
  if (existingUser.length ===0){
    throw (new NotFoundError("User not found")) 
  }
  return existingUser;
}

//service function to return users
export async function getUsers(query: IGetUserQuery) {
  return UserModel.UserModel.get(query);
}

//service function to return user by email
export function getUserByEmail(email: string) {
  logger.info("Attempting to get user by email");
  return UserModel.UserModel.getUserByEmail(email);
}

//service function to create new user
export async function createUser(user: IUser) {
  //async for using hash of bcrypt
  logger.info("Attempting to add user");

  logger.info(`comparing incomming email with existing emails`);

  //to prevent multiple user with same email
  if ((await UserModel.UserModel.getUserByEmail(user.email)).length !== 0) {
    logger.error(`Email is already used:${user.email}`);

    throw new BadRequestError("Email is already used");
  }

  const hashSaltValue = 10;

  const password = await bcrypt.hash(user.password, hashSaltValue); //hashing password

  const newUser = {
    ...user,
    password,
  };

  //creating new user
  return UserModel.UserModel.create(newUser);
}

export async function getUserPermisions(user_id:string){
  const existingUser=await UserModel.UserModel.get({ q: user_id, page: 1, size: 1 });
  
  if (existingUser.length ===0){
    throw (new NotFoundError("User not found")) 
  }

  return ;
}

//service to handle update user
export async function updateUser(id: string, updateUser: IUser) {
  //async for using hash of bcrypt
  logger.info("Attempting to update user");

  logger.info("Attempting to get user by id");

  const data = await UserModel.UserModel.get({ q: id, page: 1, size: 1 });
  const dataByEmail = await UserModel.UserModel.getUserByEmail(
    updateUser.email
  );

  if (data.length === 0) {
    logger.error("user not found");

    throw new NotFoundError("user not found");
  }

  logger.info(`comparing with existing emails`);

  //to prevent multiple user with same email
  if (data[0].email !== updateUser.email && dataByEmail.length !== 0) {
    //checking only if email is changed
    logger.error(`Email is already used:${updateUser.email}`);

    throw new BadRequestError("Email is already used");
  }

  //hashing password
  if (!(await bcrypt.compare(dataByEmail[0].password, updateUser.password))) {
    const password = await bcrypt.hash(updateUser.password, 10);
    updateUser = { ...updateUser, password: password };
  }

  return UserModel.UserModel.update(id, updateUser);
}

//service to handle delete user
export async function deleteUser(UserId: string) {
  logger.info("Attempting to delete user by id");

  const data = await UserModel.UserModel.get({ q: UserId, page: 1, size: 1 });

  if (data.length === 0) {
    logger.error("user not found");

    throw new NotFoundError("user not found");
  }

  //deleting tasks of the user
  deleteAllTaskByUserId(UserId);

  return UserModel.UserModel.delete(UserId);
}
