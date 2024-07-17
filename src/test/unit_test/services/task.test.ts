import expect from "expect";
import Sinon from "sinon";
import * as TaskService from "../../../services/task";
import * as TaskModel from "../../../models/task";
import { NotFoundError } from "../../../error/NotFoundError";
import { BadRequestError } from "../../../error/BadRequestError";
import { ITask } from "../../../interface/task";

describe("Task Service Test Suite", () => {
  describe("createTask", () => {
    let getTaskByNameStub: Sinon.SinonStub;
    let createTaskStub: Sinon.SinonStub;

    beforeEach(() => {
      getTaskByNameStub = Sinon.stub(TaskModel.TaskModel, "get");
      createTaskStub = Sinon.stub(TaskModel.TaskModel, "create");
    });

    afterEach(() => {
      getTaskByNameStub.restore();
      createTaskStub.restore();
    });

    it("Should throw error if task exists", async () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByNameStub.returns(Promise.resolve([task]));

      await expect(TaskService.createTask(task, task.user_id)).rejects.toThrow(
        new BadRequestError("Task already exists for the user")
      );
    });

    it("Should create new task for the user", async () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByNameStub.returns(Promise.resolve([]));
      createTaskStub.returns(`Task Created: ${task.name}`);

      const response = await TaskService.createTask(task, task.user_id);
      expect(response).toBe(`Task Created: ${task.name}`);
    });
  });

  describe("readTask", () => {
    let TaskModelReadTasksStub: Sinon.SinonStub;
    beforeEach(() => {
      TaskModelReadTasksStub = Sinon.stub(TaskModel.TaskModel, "get");
    });

    afterEach(() => {
      TaskModelReadTasksStub.restore();
    });
    it("should read tasks by user id", async () => {
      const tasks: ITask[] = [
        {
          id: "1",
          user_id: "1",
          name: "dance",
          is_finished: false,
        },
      ];

      TaskModelReadTasksStub.returns(Promise.resolve([tasks]));

      expect(await TaskService.readTasks(tasks[0].id)).toStrictEqual([tasks]);
    });
  });

  describe("updateTask", () => {
    let getTaskByIdStub: Sinon.SinonStub;
    let getTaskByNameStub: Sinon.SinonStub;
    let taskModelupdateTaskStub: Sinon.SinonStub;

    beforeEach(() => {
      getTaskByIdStub = Sinon.stub(TaskModel.TaskModel, "get");
    });

    afterEach(() => {
      getTaskByIdStub.restore();
    });

    it("Should throw error if task not found ", async () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByIdStub.returns(Promise.resolve([]));

      await expect(
        TaskService.updatedTask(task.id, task, task.user_id)
      ).rejects.toThrow(new NotFoundError("Task not found"));
    });

    it("Should throw error if task with updating name exists ", async () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByIdStub.returns(Promise.resolve([task]));
    });

    it("should update task", async () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByIdStub.returns(Promise.resolve([task]));

      const msg = await TaskService.updatedTask(task.id, task, task.user_id);

      expect(msg).toBe(` task updated: from (${task.name}) to (${task.name})`);

      expect(getTaskByIdStub.callCount).toBe(2);
    });
  });

  describe("deleteTask", () => {
    let TaskModelDeleteTaskStub: Sinon.SinonStub;
    let TaskModelGetTaskByIdStub: Sinon.SinonStub;

    beforeEach(() => {
      TaskModelDeleteTaskStub = Sinon.stub(TaskModel.TaskModel, "delete");
      TaskModelGetTaskByIdStub = Sinon.stub(TaskModel.TaskModel, "get");
    });

    afterEach(() => {
      TaskModelDeleteTaskStub.restore();
      TaskModelGetTaskByIdStub.restore();
    });

    it("Should throw task not found error", async () => {
      const task_id = "1000";
      const user_id = "1000";

      TaskModelGetTaskByIdStub.returns(Promise.resolve([]));

      await expect(TaskService.deleteTask(task_id, user_id)).rejects.toThrow(
        new NotFoundError("Task not found")
      );
    });

    it("Should delete task", async() => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      TaskModelGetTaskByIdStub.returns(Promise.resolve([task]));
      TaskModelDeleteTaskStub.returns(` task deleted: ${task.name}`);

      expect(await TaskService.deleteTask(task.id, task.user_id)).toBe(
        ` task deleted: ${task.name}`
      );
      expect(TaskModelGetTaskByIdStub.callCount).toBe(1);
      expect(TaskModelDeleteTaskStub.callCount).toBe(1);
    });
  });
});
