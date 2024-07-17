import request from "supertest";
import express, { response } from "express";
import router from "../../routes";
import { IUser } from "../../interface/user";
import {
  genericErrorHandler,
  notFoundError,
} from "../../middleware/errorHandler";
import expect from "expect";
import HttpStatusCode from "http-status-codes";
import helmet from "helmet";

describe("User Route Integration Test Suite", () => {
  const user: IUser = {
    id: "1",
    name: "test",
    email: "test@test.com",
    password: "TestPassword123!",
    role: "user",
    permissions: [],
  };
  const super_user: IUser = {
    id: "1",
    name: "admin",
    email: "admin@admin.com",
    password: "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
    permissions: [
      "user.post",
      "user.get",
      "user.put",
      "user.delete",
      "task.post",
      "task.put",
      "task.delete",
      "task.get",
    ],
    role: "super_user",
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

  describe("createUser API test", () => {
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

    it("Should throw error if user already exists", async () => {
      const response = await request(app)
        .post("/user")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(super_user);

      expect(response.status).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toBe("Email is already used");
    });

    it("Should create user and return status code 201", async () => {
      const response = await request(app)
        .post("/user")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(user);

      expect(response.status).toStrictEqual(HttpStatusCode.CREATED);
    });
  });

  describe("getUserById API Test", () => {
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

    it("should throw error when user is not in the system and status code 404", async () => {
      const user_id = "1000";
      const response = await request(app)
        .get(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken);

      expect(response.status).toStrictEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe("user not found");
    });

    it("should return user and respond status code 200", async () => {
      const user_id = "1"; //super_admin id
      const response = await request(app)
        .get(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken);

      expect(response.status).toStrictEqual(HttpStatusCode.OK);
    });
  });

  describe("UpdateUser API Test", () => {
    let superUserAccessToken: string;

    beforeEach(async () => {
      superUserAccessToken = (
        await request(app).post("/auth/login").send({
          email: "admin@admin.com",
          password: "admin",
        })
      ).body.accessToken;

      await request(app) //creating user
        .post("/user")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(user);
    });

    afterEach(() => {
      superUserAccessToken = "";
    });

    it("should throw error when user is not in the system and status code 404", async () => {
      const user_id = "1000";
      const userDetailToUpdate = {
        id: "1",
        name: "safal",
        email: "safalm74@gmail.com",
        role: "user",
        password: "Aadmin123!4567",
        permissions: ["task.get", "task.post", "task.put", "task.delete"],
      };

      const response = await request(app)
        .put(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(userDetailToUpdate);

      expect(response.status).toStrictEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe("user not found");
    });

    it("should throw error when user tries to update email that exists in the system", async () => {
      const user_id = "2"; //new user has id 2
      const userDetailToUpdate = { ...user, email: super_user.email };

      const response = await request(app)
        .put(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(userDetailToUpdate);

      expect(response.status).toStrictEqual(HttpStatusCode.BAD_REQUEST);
      expect(response.body.message).toBe("Email is already used");
    });

    it("should update user", async () => {
      const user_id = "2"; //new user has id 2
      const userDetailToUpdate = {
        ...user,
        email: "newTestEmail@email.com",
        password: "NewPassword@123",
      };

      const response = await request(app)
        .put(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(userDetailToUpdate);

      expect(response.status).toStrictEqual(HttpStatusCode.OK);
    });
  });

  describe("DeleteUser API Test", () => {
    let superUserAccessToken: string;

    beforeEach(async () => {
      superUserAccessToken = (
        await request(app).post("/auth/login").send({
          email: "admin@admin.com",
          password: "admin",
        })
      ).body.accessToken;

      await request(app) //creating user
        .post("/user")
        .set("Authorization", "Bearer " + superUserAccessToken)
        .send(user);
    });

    afterEach(() => {
      superUserAccessToken = "";
    });

    it("should throw error when user is not in the system and status code 404", async () => {
      const user_id = "1000";
      const response = await request(app)
        .delete(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken);

      expect(response.status).toStrictEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe("user not found");
    });

    it("should delete user", async () => {
      const user_id = "2"; //new user has id 2

      const response = await request(app)
        .delete(`/user/${user_id}`)
        .set("Authorization", "Bearer " + superUserAccessToken);

      expect(response.status).toStrictEqual(HttpStatusCode.NO_CONTENT);
    });
  });
});
