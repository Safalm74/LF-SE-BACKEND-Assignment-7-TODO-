// importing module express
import express from "express";
import * as TaskController from "../controllers/task";
import { aunthenticate, authorize } from "../middleware/auth";
import { validateReqBody, validateReqParams } from "../middleware/validation";
import { createTaskBodySchema,  taskParamSchema, updateTaskBodySchema } from "../schema/task";

//creating route
const router = express();

//route to create task: C
router.post(
  "/",
  validateReqBody(createTaskBodySchema),
  aunthenticate,
  authorize("task.post"),
  TaskController.createTask
);

//route to read tasks:  R
router.get(
  "/",
  aunthenticate,
  authorize("task.get"),
  TaskController.readTasks
);

//route to update task: U
router.put(
  "/:id",
  validateReqParams(taskParamSchema),
  validateReqBody(updateTaskBodySchema),
  aunthenticate,
  authorize("task.put"),
 TaskController.updatedTask
);

//route to delete task: D
router.delete(
  "/:id",
  validateReqParams(taskParamSchema),
  aunthenticate,
  authorize("task.delete"),
 TaskController.deleteTask
);

//exporting tasks handler router
export default router;
