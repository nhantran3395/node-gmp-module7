import request from "supertest";
import { Request, Response, NextFunction } from "express";
import sinon from "sinon";
import { v4 as uuidV4 } from "uuid";
import server from "../../index";
import { tokenValidatorMiddleware } from "../../middlewares";
import { sequelize } from "../../configs";

beforeEach(() => {
  sinon
    .stub(tokenValidatorMiddleware, "validate")
    .callsFake((req: Request, res: Response, next: NextFunction) => {
      next();
    });
});

afterEach(() => {
  (tokenValidatorMiddleware.validate as any).restore();
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});

describe("User controller test - Get users", () => {
  test("GET users/:id - Should return 400 Bad Request when get user with invalid id as parameter", async () => {
    const response = await request(server).get("/users/1");
    expect(response.statusCode).toBe(400);
  });

  test("GET users/:id - Should return 404 Not Found when get user with id that does not exist", async () => {
    const response = await request(server).get(
      "/users/60ba62ce-1c1e-47ea-9414-a35c417d9529"
    );
    expect(response.statusCode).toBe(404);
  });

  test("GET users/:id - Should return 200 Success when get user with valid id", async () => {
    const response = await request(server).get(
      "/users/a4c758cc-b37e-4b33-836a-1ae0632108d7"
    );
    expect(response.statusCode).toBe(200);

    const { id } = response.body;
    expect(id).toBe("a4c758cc-b37e-4b33-836a-1ae0632108d7");
  });
});

describe("Users controller tests - Get auto suggestions", () => {
  test("GET users/autoSuggests - Should return 200 Success and user data matched with login query", async () => {
    const response = await request(server).get(
      "/users/autoSuggests?loginQuery=samehenry&limit=1"
    );
    expect(response.statusCode).toBe(200);

    const users = response.body;
    expect(users.length).toBe(1);

    const { login } = users[0];
    expect(login).toBe("samehenry");
  });
});

describe("User controller tests - Create users", () => {
  test("POST users - Should return 400 Bad Request when create user without specifying login", async () => {
    const userData = {
      password: "junebug",
      age: 26,
    };

    const response = await request(server).post("/users").send(userData);

    expect(response.statusCode).toBe(400);
  });

  test("POST users - Should return 400 Bad Request when create user without specifying password", async () => {
    const userData = {
      login: "virgilphillips",
      age: 26,
    };

    const response = await request(server).post("/users").send(userData);

    expect(response.statusCode).toBe(400);
  });

  test("POST users - Should return 400 Bad Request when create user without specifying age", async () => {
    const userData = {
      login: "virgilphillips",
      password: "junebug",
    };

    const response = await request(server).post("/users").send(userData);

    expect(response.statusCode).toBe(400);
  });

  test("POST users - Should return 400 Bad Request when trying to create a user with login that already exists", async () => {
    const userData = {
      login: "virgilphillips",
      password: "junebug",
      age: 26,
    };

    const response = await request(server).post("/users").send(userData);

    expect(response.statusCode).toBe(400);
  });

  test("POST users - Should return 201 Created when user data is valid", async () => {
    const userData = {
      login: `test-user-${uuidV4()}`,
      password: "sunshine",
      age: 32,
    };

    const response = await request(server).post("/users").send(userData);
    expect(response.statusCode).toBe(201);
  });
});

describe("User controller tests - Update users", () => {
  test("UPDATE users - Should return 400 Bad Request when update user with invalid id as parameter", async () => {
    const userData = {
      login: `test-user-${uuidV4()}`,
      password: "sunshine",
      age: 32,
    };

    const response = await request(server).put("/users/1").send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("UPDATE users - Should return 404 Not Found when update user with id that does not exist as parameter", async () => {
    const userData = {
      login: `test-user-${uuidV4()}`,
      password: "sunshine",
      age: 32,
    };

    const response = await request(server)
      .put("/users/27abf5a1-f995-4e5f-a160-7b937794b42d")
      .send(userData);
    expect(response.statusCode).toBe(404);
  });

  test("UPDATE users - Should return 400 Bad Request when update user without providing new login", async () => {
    const userData = {
      password: "sunshine",
      age: 32,
    };

    const response = await request(server)
      .put("/users/a4c758cc-b37e-4b33-836a-1ae0632108d7")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("UPDATE users - Should return 400 Bad Request when update user without providing new password", async () => {
    const userData = {
      login: `test-user-${uuidV4()}`,
      age: 32,
    };

    const response = await request(server)
      .put("/users/a4c758cc-b37e-4b33-836a-1ae0632108d7")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("UPDATE users - Should return 400 Bad Request when update user without providing new age", async () => {
    const userData = {
      login: `test-user-${uuidV4()}`,
      password: "updated",
    };

    const response = await request(server)
      .put("/users/a4c758cc-b37e-4b33-836a-1ae0632108d7")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("UPDATE users - Should return 200 Success when update user with valid info", async () => {
    const userData = {
      login: `test-user-${uuidV4()}`,
      password: "updated",
      age: 29,
    };

    const response = await request(server)
      .put("/users/a4c758cc-b37e-4b33-836a-1ae0632108d7")
      .send(userData);
    expect(response.statusCode).toBe(200);
  });
});

describe("User controller tests - Delete users", () => {
  test("DELETE users - Should return 400 Bad Request when delete user with invalid id as parameter", async () => {
    const response = await request(server).delete("/users/1");
    expect(response.statusCode).toBe(400);
  });

  test("DELETE users - Should return 404 Not Found when update user with id that does not exist as parameter", async () => {
    const response = await request(server).delete(
      "/users/27abf5a1-f995-4e5f-a160-7b937794b42d"
    );
    expect(response.statusCode).toBe(404);
  });

  test("DELETE users - Should return 200 Success when user id is valid", async () => {
    const response = await request(server).delete(
      "/users/a4c758cc-b37e-4b33-836a-1ae0632108d7"
    );
    expect(response.statusCode).toBe(200);
  });
});
