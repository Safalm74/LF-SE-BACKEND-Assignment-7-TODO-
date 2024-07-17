import { NextFunction, Response } from "express";
import { Request } from "../interface/auth";
import * as TaskhandlerService from "../services/task";
import HttpStatusCode from "http-status-codes";
import loggerWithNameSpace from "../utils/logger";

const logger = loggerWithNameSpace("Task Controller");

//controller function to createtask
export async function createTask(req: Request, res: Response, next: NextFunction) {
  logger.info("Request: Add task");

  const user_id = req.user!.id;

  logger.info(`adding task by user: ${user_id}`);

  try {
    const { body } = req;

    res.status(HttpStatusCode.CREATED).json({
      Message: await TaskhandlerService.createTask(body, user_id!),
    });
  } catch (error) {
    next(error);
  }
}

//controller function to readtask
export async function readTasks(req: Request, res: Response, next: NextFunction) {
  logger.info("Request: Read Task");

  const user_id = req.user!.id;

  logger.info(`reading task by user: ${user_id}`);

  const data =await TaskhandlerService.readTasks(user_id);

  res.status(HttpStatusCode.OK).json(data);
}

//controller function to readtask
export function readRemainingTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Request: Read Task");

  // const user_id = req.user!.id;
  // const data = TaskhandlerService.readRemainingTasks(user_id);

  // res.status(HttpStatusCode.OK).json(data);
}

//controller function to readtask
export function readFinishedTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Request: Read Task");

  // const user_id = req.user!.id;
  // const data = TaskhandlerService.readFinishedTasks(user_id);

  // res.status(HttpStatusCode.OK).json(data);
}

//controller function to update task
export async function updatedTask(req: Request, res: Response, next: NextFunction) {
  logger.info("Request: Update Task");

  const user_id = req.user!.id;

  logger.info(`adding task by user: ${user_id}`);

  try {
    const id = `${req.params.id}`;
    const { body } = req;

    res.status(HttpStatusCode.OK).json({
      msg: await TaskhandlerService.updatedTask(id, body, user_id),
    });
  } catch (error) {
    next(error);
  }
}

//controller function to delete task
export function deleteTask(req: Request, res: Response, next: NextFunction) {
  logger.info("Request: Read Task");

  const user_id = req.user!.id;

  logger.info(`Removing task by user: ${user_id}`);

  try {
    const id = `${req.params.id}`;

    res.status(HttpStatusCode.NO_CONTENT).json({
      msg: TaskhandlerService.deleteTask(id, user_id),
    });
  } catch (error) {
    next(error);
    return;
  }
}
