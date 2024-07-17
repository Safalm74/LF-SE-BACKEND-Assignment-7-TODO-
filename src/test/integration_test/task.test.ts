import request from "supertest";
import express, { response } from "express";
import router from "../../routes";
import {
  genericErrorHandler,
  notFoundError,
} from "../../middleware/errorHandler";
import expect from "expect";
import HttpStatusCode from "http-status-codes";
import helmet from "helmet";
import { ITask } from "../../interface/task";

describe("Task Route Integration Test Suite", () => {
  const task: ITask = {
    id: "1",
    user_id: "1",
    name: "read book",
    is_finished: false,
  };

  const app = express();

  //Middleware to add security level
  app.use(helmet());

  app.use(express.json());

  app.use(router);

  //Middleware to handle errors
  app.use(genericErrorHandler);

  //Middleware to handle if route requested is not found
  app.use(notFoundError);

  describe("createTask API test", () => {
    let superUserAccessToken: string;

    beforeEach(async () => {
      superUserAccessToken = (
        await request(app).post("/auth/login").send({
          email: "admin@admin.com",
          password: "admin",
        })
      ).body.accessToken;

      await request(app)
        .post("/task")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(task);
    });

    afterEach(() => {
      superUserAccessToken = "";
    });

    it("Should throw error if task already exists", async () => {
      const response = await request(app)
        .post("/task")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(task);

      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toBe("Task already exists for the user");
    });

    it("Should create task and return status code 201", async () => {
      const response = await request(app)
        .post("/task")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send({
          name: "sing",
        });

      expect(response.status).toStrictEqual(HttpStatusCode.CREATED);
    });
  });

  describe("getTask API Test", () => {
    let superUserAccessToken: string;

    beforeEach(async () => {
      superUserAccessToken = (
        await request(app).post("/auth/login").send({
          email: "admin@admin.com",
          password: "admin",
        })
      ).body.accessToken;
    });

    afterEach(() => {
      superUserAccessToken = "";
    });

    it("should return tasks of the user and respond status code 200", async () => {
      const response = await request(app)
        .get(`/task/`)
        .set("Authorization", "Bearer " + superUserAccessToken);

      expect(response.status).toStrictEqual(HttpStatusCode.OK);
    });
  });

  describe("UpdateTask API Test", () => {
    let superUserAccessToken: string;

    beforeEach(async () => {
      superUserAccessToken = (
        await request(app).post("/auth/login").send({
          email: "admin@admin.com",
          password: "admin",
        })
      ).body.accessToken;

      await request(app)
        .post("/task")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(task);
    });

    afterEach(() => {
      superUserAccessToken = "";
    });

    it("should throw error when task is not in the system and status code 404", async () => {
      const task_id = 1000;
      const taskDetailToUpdate = {
        name: "read book",
        user_id: "1",
      };

      const response = await request(app)
        .put(`/task/${task_id}/`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(taskDetailToUpdate);

      expect(response.status).toStrictEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe("Task not found");
    });


    it("should update task", async () => {
      const user_id = 1; 
      const task_id=1;
      const taskDetailToUpdate = {
        ...task,
        name: "dance",
        user_id:user_id,
        task_id:task_id
      };

      const response = await request(app)
        .put(`/task/${task_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(taskDetailToUpdate );

      expect(response.status).toStrictEqual(HttpStatusCode.OK);
    });
  });

  describe("DeleteTask API Test", () => {
    let superUserAccessToken: string;

    beforeEach(async () => {
      superUserAccessToken = (
        await request(app).post("/auth/login").send({
          email: "admin@admin.com",
          password: "admin",
        })
      ).body.accessToken;

      await request(app)
        .post("/task")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send({
          name: "read book",
          user_id: "1",
        });
    });
    afterEach(() => {
      superUserAccessToken = "";
    });

    it("should throw error when task is not in the system and status code 404", async () => {
      const task_id = "1000";
      const response = await request(app)
        .delete(`/task/${task_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send({
          name: "read book",
          user_id: task_id,
        });

      expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
    });

    it("should delete task", async () => {
      const task_id = "1";

      const response = await request(app)
        .delete(`/task/${task_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send({
          name: "read book",
          user_id: task_id,
        });;

      expect(response.status).toStrictEqual(HttpStatusCode.NO_CONTENT);
    });
  });
});
