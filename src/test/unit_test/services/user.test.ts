import expect from "expect";
import Sinon from "sinon";
import * as UserService from "../../../services/user";
import * as TaskService from "../../../services/task";
import * as UserModel from "../../../models/user";
import { NotFoundError } from "../../../error/NotFoundError";
import { IUser } from "../../../interface/user";
import bcrypt from "bcrypt";
import { BadRequestError } from "../../../error/BadRequestError";
import { rejects } from "assert";

describe("User Service Test Suite", () => {
  describe("getUserById: ", () => {
    let getUserByIdStub: Sinon.SinonStub;

    beforeEach(() => {
      getUserByIdStub=Sinon.stub(UserModel.UserModel, "get")
    });

    afterEach(() => {
      getUserByIdStub.restore();
    });

    it("Should throw error", () => {
      getUserByIdStub.resolves(undefined);

      expect(() => {
        return UserService.getUserById("1000");
      }).rejects.toThrow(new NotFoundError("user not found"));
    });

    it("Should return user if user found", async() => {
      const user: IUser = {
        id: "1",
        name: "admin",
        email: "admin@admin.com",
        password:
          "$2b$10$8bnVy6XkAPndk9.XZEv2qOHHpiqLKfQJVVMFkkrb0Ef96hj09qjli",
        role_id: 2,
      };

      getUserByIdStub.returns(Promise.resolve([user]))

      const response = await UserService.getUserById("1");

      expect(response).toStrictEqual([user]);
    });
  });

  describe("createUser", () => {
    let bcryptHashStub: Sinon.SinonStub;
    let userModelCreateUserStub: Sinon.SinonStub;
    let getUserByEmailStub: Sinon.SinonStub;

    beforeEach(() => {
      bcryptHashStub = Sinon.stub(bcrypt, "hash");
      userModelCreateUserStub = Sinon.stub(UserModel.UserModel, "create");
      getUserByEmailStub = Sinon.stub(UserModel.UserModel, "getUserByEmail");
    });

    afterEach(() => {
      bcryptHashStub.restore();
      userModelCreateUserStub.restore();
      getUserByEmailStub.restore();
    });

    it("Should throw error if email exists", async () => {
      const user: IUser = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "test password",
        role_id: 1,
      };

      bcryptHashStub.resolves("HashedPassword");
      getUserByEmailStub.returns(user);

      await expect(UserService.createUser(user,'1')).rejects.toThrow(
        new BadRequestError("Email is already used")
      );
    });

    it("Should create new user", async () => {
      const user: IUser = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "test password",
        role_id: 1,
      };

      getUserByEmailStub.returns([]);
      bcryptHashStub.resolves("HashedPassword");

      await UserService.createUser(user,'1');

      expect(bcryptHashStub.callCount).toBe(1);
      expect(bcryptHashStub.getCall(0).args).toStrictEqual([user.password, 10]);
      expect(userModelCreateUserStub.callCount).toBe(1);
      expect(userModelCreateUserStub.getCall(0).args).toStrictEqual([
        { ...user, password: "HashedPassword" },"1"
      ]);
    });
  });

  describe("updateUser", () => {
    let getUserByIdStub: Sinon.SinonStub;
    let getUserByEmailStub: Sinon.SinonStub;
    let bcryptHashStub: Sinon.SinonStub;
    let userModelUpdateUserStub: Sinon.SinonStub;

    beforeEach(() => {
      getUserByEmailStub = Sinon.stub(UserModel.UserModel, "getUserByEmail");
      getUserByIdStub = Sinon.stub(UserModel.UserModel, "get");
      bcryptHashStub = Sinon.stub(bcrypt, "hash");
      userModelUpdateUserStub = Sinon.stub(UserModel.UserModel, "update");
    });

    afterEach(() => {
      getUserByEmailStub.restore();
      getUserByIdStub.restore();
      bcryptHashStub.restore();
      userModelUpdateUserStub.restore();
    });

    it("Should throw error if user not found", async() => {
      
      getUserByIdStub.returns(Promise.resolve([]));
      
      await expect( UserService.getUserById("1000")).rejects.toThrow(new NotFoundError("User not found"))
    });

    it("Should throw error if email exists", async () => {
      const user: IUser = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "test password",
        role_id:1
      };

      bcryptHashStub.resolves("HashedPassword");
      getUserByEmailStub.returns({ ...user, email: "test2@test.com" });
      getUserByIdStub.returns(Promise.resolve([user]));

      await expect(
        UserService.updateUser("1", { ...user, email: "test2@test.com" })
      ).rejects.toThrow(new BadRequestError("Email is already used"));
    });

    it("Should update user", async () => {
      const user: IUser = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "test password",
        role_id:1
      };

      getUserByEmailStub.returns(Promise.resolve([user]))
      getUserByIdStub.returns(Promise.resolve([user]));
      bcryptHashStub.resolves("HashedPassword");

      await UserService.updateUser("1", {...user,password:"new password"});

      expect(bcryptHashStub.callCount).toBe(1);
      expect(bcryptHashStub.getCall(0).args).toStrictEqual(["new password", 10]);
      expect(userModelUpdateUserStub.callCount).toBe(1);
      expect(userModelUpdateUserStub.getCall(0).args).toStrictEqual(['1',
        { ...user, password: "HashedPassword"},
      ]);
    });

  });

  describe("deleteUser",()=>{
    let getUserByIdStub:Sinon.SinonStub;
    let userModelDeleteUserStub:Sinon.SinonStub;
    let deleteAllTaskByUserId:Sinon.SinonStub;

    beforeEach(()=>{
      getUserByIdStub=Sinon.stub(UserModel.UserModel, "get");
      userModelDeleteUserStub=Sinon.stub(UserModel.UserModel, "delete");
      deleteAllTaskByUserId=Sinon.stub(TaskService, "deleteAllTaskByUserId");
    });


    afterEach(()=>{
      getUserByIdStub.restore();
      userModelDeleteUserStub.restore();
      deleteAllTaskByUserId.restore();
      });

    it("should throw error if user not found",async ()=>{
      getUserByIdStub.returns(Promise.resolve([]));

      await expect( UserService.deleteUser("1000")).rejects.toThrow(new NotFoundError("user not found"))
    });

    it("should delete user",async()=>{
      const user: IUser = {
        id: "1",
        name: "test",
        email: "test@test.com",
        password: "test password",
        role_id:1
      };

      getUserByIdStub.returns(user);
      deleteAllTaskByUserId.returns(undefined);
      userModelDeleteUserStub.resolves({});

      const message=await UserService.deleteUser(user.id);

      expect(message).toStrictEqual({msg: "User Deleted: 1"});
    });
  });
});
