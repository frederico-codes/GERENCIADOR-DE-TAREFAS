 import  request from "supertest";
import { hash } from "bcrypt";
import { app } from "../app";
import { prisma } from "../database/prisma";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

describe("Tasks routes", () => {
  let token: string;
  let user_id: string;
  let task_ids: string[] = [];
  let team_ids: string[] = []
  let team_member_ids: string[] = []

  beforeAll(async () => {
    await prisma.$connect();

    const user = await prisma.user.create({
      data: {
        name: "Admin",
        email: `admin-${Date.now()}@test.com`,
        password: await hash("123456", 10),
        role: "admin",
      },      
    });    

    user_id = user.id;

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password: "123456",
    });

    token = response.body.token;
  });

  afterAll(async () => {
    await prisma.taskHistory.deleteMany({
      where: {
        taskId: {
          in: task_ids,
        },
      },
    })

    if (task_ids.length > 0) {
      await prisma.task.deleteMany({
        where: {
          id: {
            in: task_ids,
          },
        },
      })
    }

    if (team_member_ids.length > 0) {
      await prisma.teamMember.deleteMany({
        where: {
          id: {
            in: team_member_ids,
          },
        },
      })
    }

    if (team_ids.length > 0) {
      await prisma.team.deleteMany({
        where: {
          id: {
            in: team_ids,
          },
        },
      })
    }

    if (user_id) {
      await prisma.user.deleteMany({
        where: { id: user_id },
      })
    }

    await prisma.$disconnect()
  })

  it("should create a task", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Test team",
      },
    });

  
    team_ids.push(team.id);

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team.id,
      },
    });

    team_member_ids.push(teamMember.id);

    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: `Task ${Date.now()}`,
        description: "Test task",
        status: "pending",
        priority: "medium",
        assignedTo: user_id,
        teamId: team.id,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toContain("Task");

      task_ids.push(response.body.id);
   });

    it("should list tasks", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Test team",
      },
    })

    team_ids.push(team.id)

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team.id,
      },
    })

    team_member_ids.push(teamMember.id)

    const task = await prisma.task.create({
      data: {
        title: `Task ${Date.now()}`,
        description: "Test task",
        status: "pending",
        priority: "medium",
        assignedTo: user_id,
        teamId: team.id,
      },
    })

    task_ids.push(task.id)

    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("tasks")
    expect(Array.isArray(response.body.tasks)).toBe(true)
    expect(response.body.tasks.length).toBeGreaterThan(0)
  })

  it("should update a task", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Test team",
      },
    })

    team_ids.push(team.id)

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team.id,
      },
    })

    team_member_ids.push(teamMember.id)

    const task = await prisma.task.create({
      data: {
        title: `Task ${Date.now()}`,
        description: "Old description",
        status: "pending",
        priority: "medium",
        assignedTo: user_id,
        teamId: team.id,
      },
    })

    task_ids.push(task.id)

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        description: "Updated description",
        status: "in_progress",
        priority: "high",
      })

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(task.id)
    expect(response.body.title).toBe("Updated Task")
    expect(response.body.description).toBe("Updated description")
    expect(response.body.status).toBe("in_progress")
    expect(response.body.priority).toBe("high")
  })

  it("should delete a task", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Test team",
      },
    })

    team_ids.push(team.id)

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team.id,
      },
    })

    team_member_ids.push(teamMember.id)

    const task = await prisma.task.create({
      data: {
        title: `Task ${Date.now()}`,
        description: "Test task",
        status: "pending",
        priority: "medium",
        assignedTo: user_id,
        teamId: team.id,
      },
    })

    const response = await request(app)
      .delete(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Tarefa deletada com sucesso!")

    const deletedTask = await prisma.task.findUnique({
      where: { id: task.id },
    })

    expect(deletedTask).toBeNull()
  })

});