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

describe("Group controller test - Get group by id", () => {
  test("GET groups/:id - Should return 400 Bad Request when get group with invalid id as parameter", async () => {
    const response = await request(server).get("/groups/1");
    expect(response.statusCode).toBe(400);
  });

  test("GET groups/:id - Should return 404 Not Found when get group with id that does not exist", async () => {
    const response = await request(server).get(
      "/groups/60ba62ce-1c1e-47ea-9414-a35c417d9529"
    );
    expect(response.statusCode).toBe(404);
  });

  test("GET groups/:id - Should return 200 Success when get group with valid id", async () => {
    const response = await request(server).get(
      "/groups/2fc147cc-1689-486d-bacd-0a4458177c05"
    );
    expect(response.statusCode).toBe(200);

    const { id } = response.body;
    expect(id).toBe("2fc147cc-1689-486d-bacd-0a4458177c05");
  });
});

describe("Group controller test - Get group by id", () => {
  test("GET groups/:id - Should return 200 Success", async () => {
    const response = await request(server).get("/groups");
    expect(response.statusCode).toBe(200);
  });
});

describe("Group controller test - Create group", () => {
  test("POST groups - Should return 400 Bad Request when create group without specifying name", async () => {
    const groupData = {
      permissions: ["READ", "WRITE"],
    };

    const response = await request(server).post("/users").send(groupData);

    expect(response.statusCode).toBe(400);
  });

  test("POST groups - Should return 400 Bad Request when create group without specifying permissions", async () => {
    const groupData = {
      name: `TestGroup-${uuidV4()}`,
    };

    const response = await request(server).post("/users").send(groupData);

    expect(response.statusCode).toBe(400);
  });

  test("POST groups - Should return 400 Bad Request when create group with permission that does not exist", async () => {
    const groupData = {
      name: `TestGroup-${uuidV4()}`,
      permissions: ["TEST", "WRITE"],
    };

    const response = await request(server).post("/groups").send(groupData);

    expect(response.statusCode).toBe(400);
  });

  test("POST groups - Should return 400 Bad Request when trying to create a group with name that already exists", async () => {
    const groupData = {
      group: "Developers",
      permissions: ["READ", "WRITE"],
    };

    const response = await request(server).post("/groups").send(groupData);

    expect(response.statusCode).toBe(400);
  });

  test("POST groups - Should return 201 Created when group data is valid", async () => {
    const groupData = {
      name: `TestGroup-${uuidV4()}`,
      permissions: ["READ", "WRITE"],
    };

    const response = await request(server).post("/groups").send(groupData);
    expect(response.statusCode).toBe(201);
  });
});

describe("Group controller tests - Update group", () => {
  test("UPDATE groups - Should return 400 Bad Request when update group with invalid id as parameter", async () => {
    const groupData = {
      name: "UpdatedGroup",
      permissions: ["READ", "WRITE"],
    };

    const response = await request(server).put("/groups/1").send(groupData);
    expect(response.statusCode).toBe(400);
  });

  test("UPDATE groups - Should return 404 Not Found when update group with id that does not exist as parameter", async () => {
    const groupData = {
      name: "UpdatedGroup",
      permissions: ["READ", "WRITE"],
    };

    const response = await request(server)
      .put("/groups/27abf5a1-f995-4e5f-a160-7b937794b42d")
      .send(groupData);
    expect(response.statusCode).toBe(404);
  });

  test("UPDATE groups - Should return 400 Bad Request when update group without providing new group name", async () => {
    const groupData = {
      permissions: ["READ", "WRITE"],
    };

    const response = await request(server)
      .put("/groups/04f5143a-42ac-4bbd-87d0-66e9a03a287d")
      .send(groupData);
    expect(response.statusCode).toBe(400);
  });

  test("UPDATE groups - Should return 200 Success when update group with valid info", async () => {
    const groupData = {
      name: "UpdatedGroup",
      permissions: ["READ", "WRITE", "SHARE"],
    };

    const response = await request(server)
      .put("/groups/04f5143a-42ac-4bbd-87d0-66e9a03a287d")
      .send(groupData);
    expect(response.statusCode).toBe(200);
  });
});

describe("Group controller tests - Delete groups", () => {
  test("DELETE groups - Should return 400 Bad Request when delete group with invalid id as parameter", async () => {
    const response = await request(server).delete("/groups/1");
    expect(response.statusCode).toBe(400);
  });

  test("DELETE groups - Should return 404 Not Found when delete group with id that does not exist as parameter", async () => {
    const response = await request(server).delete(
      "/groups/27abf5a1-f995-4e5f-a160-7b937794b42d"
    );
    expect(response.statusCode).toBe(404);
  });

  test("DELETE groups - Should return 200 Success when group id is valid", async () => {
    const response = await request(server).delete(
      "/groups/ff7fe308-3bb0-4024-b29b-b56285344657"
    );
    expect(response.statusCode).toBe(200);
  });
});
