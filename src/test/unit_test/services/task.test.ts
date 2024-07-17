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
      getTaskByNameStub = Sinon.stub(TaskModel, "getTaskByName");
      createTaskStub = Sinon.stub(TaskModel, "createTask");
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

      getTaskByNameStub.returns(task);

      expect(() => TaskService.createTask(task, task.user_id)).toThrow(
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

      getTaskByNameStub.returns(undefined);
      createTaskStub.returns(`Task Created: ${task.name}`);

      const response = TaskModel.createTask(task, task.user_id);
      expect(response).toBe(`Task Created: ${task.name}`);
    });
  });

  describe("readTask", () => {
    let TaskModelReadTasksStub: Sinon.SinonStub;
    beforeEach(() => {
      TaskModelReadTasksStub = Sinon.stub(TaskModel, "readTasks");
    });

    afterEach(() => {
      TaskModelReadTasksStub.restore();
    });
    it("should read tasks by user id", () => {
      const tasks: ITask[] = [
        {
          id: "1",
          user_id: "1",
          name: "dance",
          is_finished: false,
        },
      ];

      TaskModelReadTasksStub.returns(tasks);

      expect(TaskModel.readTasks(tasks[0].id)).toStrictEqual(tasks);
    });
  });

  describe("readRemainingTasks", () => {
    let TaskModelReadRemainingTasksStub: Sinon.SinonStub;
    beforeEach(() => {
      TaskModelReadRemainingTasksStub = Sinon.stub(TaskModel, "readTasks");
    });

    afterEach(() => {
      TaskModelReadRemainingTasksStub.restore();
    });

    it("should read tasks by user id", () => {
      const tasks: ITask[] = [
        {
          id: "1",
          user_id: "1",
          name: "dance",
          is_finished: false,
        },
      ];

      TaskModelReadRemainingTasksStub.returns(tasks);

      expect(TaskModel.readTasks(tasks[0].id)).toStrictEqual(tasks);
    });
  });

  describe("readFinishedTasks", () => {
    let TaskModelReadFinishedTasksStub: Sinon.SinonStub;

    beforeEach(() => {
      TaskModelReadFinishedTasksStub = Sinon.stub(TaskModel, "readTasks");
    });

    afterEach(() => {
      TaskModelReadFinishedTasksStub.restore();
    });

    it("should read tasks by user id", () => {
      const tasks: ITask[] = [
        {
          id: "1",
          user_id: "1",
          name: "dance",
          is_finished: true,
        },
      ];

      TaskModelReadFinishedTasksStub.returns(tasks);

      expect(TaskModel.readTasks(tasks[0].id)).toStrictEqual(tasks);
    });
  });

  describe("updateTask", () => {
    let getTaskByIdStub: Sinon.SinonStub;
    let getTaskByNameStub: Sinon.SinonStub;
    let taskModelupdateTaskStub: Sinon.SinonStub;

    beforeEach(() => {
      getTaskByIdStub = Sinon.stub(TaskModel, "getTaskById");
      getTaskByNameStub = Sinon.stub(TaskModel, "getTaskByName");
      taskModelupdateTaskStub = Sinon.stub(TaskModel, "updateTask");
    });

    afterEach(() => {
      getTaskByIdStub.restore();
      getTaskByNameStub.restore();
      taskModelupdateTaskStub.restore();
    });

    it("Should throw error if task not found ", () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByIdStub.returns(undefined);

      expect(() =>
        TaskService.updatedTask(task.id, task, task.user_id)
      ).toThrow(new NotFoundError("Task not found"));
    });

    it("Should throw error if task with updating name exists ", () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByIdStub.returns(task);
      getTaskByNameStub.returns(task);

      expect(() =>
        TaskService.updatedTask(task.id, task, task.user_id)
      ).toThrow(new BadRequestError("Task already exists for the user"));
    });

    it("should update task", () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      getTaskByIdStub.returns(task);
      getTaskByNameStub.returns(undefined);
      taskModelupdateTaskStub.returns(
        ` task updated: from (${task}) to (${{ ...task, name: "sing" }})`
      );

      expect(TaskService.updatedTask(task.id, task, task.user_id)).toBe(
        ` task updated: from (${task}) to (${{ ...task, name: "sing" }})`
      );

      expect(getTaskByIdStub.callCount).toBe(1);
      expect(getTaskByIdStub.getCall(0).args).toStrictEqual([
        task.user_id,
        task.id,
      ]);
      expect(getTaskByNameStub.callCount).toBe(1);
      expect(getTaskByNameStub.getCall(0).args).toStrictEqual([
        task.user_id,
        task.name,
      ]);
    });
  });

  describe("deleteTask", () => {
    let TaskModelDeleteTaskStub: Sinon.SinonStub;
    let TaskModelGetTaskByIdStub: Sinon.SinonStub;

    beforeEach(() => {
      TaskModelDeleteTaskStub = Sinon.stub(TaskModel, "deleteTask");
      TaskModelGetTaskByIdStub = Sinon.stub(TaskModel, "getTaskById");
    });

    afterEach(() => {
      TaskModelDeleteTaskStub.restore();
      TaskModelGetTaskByIdStub.restore();
    });

    it("Should throw task not found error", () => {
      const task_id = "1000";
      const user_id = "1000";

      TaskModelGetTaskByIdStub.returns(undefined);

      expect(() => TaskService.deleteTask(task_id, user_id)).toThrow(
        new NotFoundError("Task not found")
      );
    });

    it("Should delete task", () => {
      const task: ITask = {
        id: "1",
        user_id: "1",
        name: "dance",
        is_finished: false,
      };

      TaskModelGetTaskByIdStub.returns(task);
      TaskModelDeleteTaskStub.returns(` task deleted: ${task.name}`);

      expect(TaskService.deleteTask(task.id, task.user_id)).toBe(
        ` task deleted: ${task.name}`
      );
      expect(TaskModelGetTaskByIdStub.callCount).toBe(1);
      expect(TaskModelGetTaskByIdStub.getCall(0).args).toStrictEqual([
        task.user_id,
        task.id,
      ]);
      expect(TaskModelDeleteTaskStub.callCount).toBe(1);
      expect(TaskModelDeleteTaskStub.getCall(0).args).toStrictEqual([
        task.user_id,
        task.id,
      ]);
    });
  });

  describe("deleteAllTaskByUserId",()=>{
    let TaskModeldeleteAllTaskByUserIdStub:Sinon.SinonStub;

    beforeEach(()=>{
        TaskModeldeleteAllTaskByUserIdStub=Sinon.stub(TaskModel,"deleteAllTaskByUserId");
    });

    afterEach(()=>{
        TaskModeldeleteAllTaskByUserIdStub.restore();
    });

    it("Should delete all task for the user",()=>{
        const user_id="1"

        TaskModeldeleteAllTaskByUserIdStub.returns(`Tasks Deleted for user: ${user_id}`);

        expect(TaskService.deleteAllTaskByUserId(user_id)).toBe(`Tasks Deleted for user: ${user_id}`);
    });
  });
});
