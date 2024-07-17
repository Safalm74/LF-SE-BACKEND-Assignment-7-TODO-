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

describe("Auth Route Integration Test Suite", () => {
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

  describe("login", () => {
    it("Should throw error if user doesnt exists", async () => {
      const response = await request(app)
      .post("/auth/login")
      .send({
        email: "Unknownadmin@admin.com",
        password: "adminWrongPassword",
      })
      expect(response.status).toEqual(HttpStatusCode.NOT_FOUND);
      expect(response.body.message).toBe("user not found");
    });

    it("Should throw error for incorrect password", async () => {
        const response = await request(app)
        .post("/auth/login")
        .send({
          email: "admin@admin.com",
          password: "adminWrongPassword",
        })

        expect(response.status).toEqual(HttpStatusCode.UNAUTHORIZED);
        expect(response.body.message).toBe("Invalid email or password");
    });

    it("Should return access and refresh token", async () => {
        const response = await request(app)
        .post("/auth/login")
        .send({
          email: "admin@admin.com",
          password: "admin",
        })

        expect(response.status).toEqual(HttpStatusCode.OK);
    });
  });

  describe("refreshAccessToken", () => {
    let superUserRefreshToken: string;
    let superUserAccessToken: string;

    beforeEach(async () => {
        superUserAccessToken = (
            await request(app).post("/auth/login").send({
              email: "admin@admin.com",
              password: "admin",
            })
          ).body.accessToken;
          superUserRefreshToken = (
            await request(app).post("/auth/login").send({
              email: "admin@admin.com",
              password: "admin",
            })
          ).body.refreshToken;
    });

    afterEach(() => {
        superUserRefreshToken = "";
        superUserAccessToken="";
    });

    it("Should return new accesss token", async () => {
      const response = await request(app)
      .post("/auth/refreshAccessToken")
      .set("Authorization", "Bearer " + superUserRefreshToken)//using access token

      expect(response.status).toEqual(HttpStatusCode.OK);
    });

  });

});
