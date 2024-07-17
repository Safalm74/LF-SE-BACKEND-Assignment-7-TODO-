import expect from "expect";
import Sinon from "sinon";
import * as UserService from "../../../services/user";
import { IUser } from "../../../interface/user";
import bcrypt from "bcrypt";
import * as AuthService from "../../../services/auth";
import JWT from "jsonwebtoken";
import { UnaunthicatedError } from "../../../error/UnauthenticatedError";
import { BadRequestError } from "../../../error/BadRequestError";

describe("Auth Service Test Suite", () => {
  describe("login: ", () => {
    let UserServiceGetUserByEmailStub: Sinon.SinonStub;
    let bcryptCompareStub: Sinon.SinonStub;
    let JWTSignStub: Sinon.SinonStub;
    let JWTVerifyStub: Sinon.SinonStub;
    let AuthModelcreateRefreshTokenStub: Sinon.SinonStub;

    beforeEach(() => {
      UserServiceGetUserByEmailStub = Sinon.stub(UserService, "getUserByEmail");
      bcryptCompareStub = Sinon.stub(bcrypt, "compare");
      JWTSignStub = Sinon.stub(JWT, "sign");
      JWTVerifyStub = Sinon.stub(JWT, "verify");
    });

    afterEach(() => {
      UserServiceGetUserByEmailStub.restore();
      bcryptCompareStub.restore();
      JWTSignStub.restore();
      JWTVerifyStub.restore();
    });

    it("Should throw UnaunthicatedError if user doesnot exist", async () => {
      const testLoginCredentials: Pick<IUser, "email" | "password"> = {
        email: "test@test.com",
        password: "password",
      };

      UserServiceGetUserByEmailStub.returns(Promise.resolve([]));

      await expect(() =>
        AuthService.login(testLoginCredentials)
      ).rejects.toThrow(new UnaunthicatedError("Invalid email or password"));
    });

    it("Should throw UnaunthicatedError if password doesnt match", async () => {
      const testLoginCredentials: Pick<IUser, "email" | "password"> = {
        email: "test@test.com",
        password: "password",
      };

      bcryptCompareStub.resolves(false);
      UserServiceGetUserByEmailStub.returns({
        ...testLoginCredentials,
        password: "wrong Password",
      });

      await expect(() =>
        AuthService.login(testLoginCredentials)
      ).rejects.toThrow(new UnaunthicatedError("Invalid email or password"));
    });

    it("Should create and return access token", async () => {
      const testLoginCredentials: Pick<IUser, "email" | "password"> = {
        email: "test@test.com",
        password: "password",
      };

      bcryptCompareStub.resolves(true);
      UserServiceGetUserByEmailStub.resolves([{
        ...testLoginCredentials,
        password: "Password",
      }]);
      JWTSignStub.resolves("<Token>");

      await expect(
        AuthService.login(testLoginCredentials)
      ).resolves.toStrictEqual({
        accessToken: "<Token>",
        refreshToken: "<Token>",
      });
    });
  });

  describe("refreshAccessToken", () => {
    let UserServiceGetUserByEmailStub: Sinon.SinonStub;
    let bcryptCompareStub: Sinon.SinonStub;
    let JWTSignStub: Sinon.SinonStub;
    let JWTVerifyStub: Sinon.SinonStub;

    beforeEach(() => {
      UserServiceGetUserByEmailStub = Sinon.stub(UserService, "getUserByEmail");
      bcryptCompareStub = Sinon.stub(bcrypt, "compare");
      JWTSignStub = Sinon.stub(JWT, "sign");
      JWTVerifyStub = Sinon.stub(JWT, "verify");
    });

    afterEach(() => {
      UserServiceGetUserByEmailStub.restore();
      bcryptCompareStub.restore();
      JWTSignStub.restore();
      JWTVerifyStub.restore();
    });

    it("should return UnaunthicatedError", async () => {
      const token = "unknown token";

      await expect(AuthService.refreshAccessToken(token)).rejects.toThrow(
        new UnaunthicatedError("Un-Aunthenticated")
      );
    });

    it("should return JWT token", async () => {
      const token = "Bearer <Token>";
      const decoded = {
        id: "1",
        name: "test name",
        email: "test@test.com",
        permissions: [],
      };

      JWTVerifyStub.resolves(decoded);
      JWTSignStub.resolves("<Token>");

      await expect(AuthService.refreshAccessToken(token)).resolves.toStrictEqual({ accessToken: "<Token>" });
    });
  });
});
