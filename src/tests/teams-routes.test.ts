import request from "supertest"
import { hash } from "bcrypt"
import { app } from "../app"
import { prisma } from "../database/prisma"
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"

describe("Teams routes", () => {
  let token: string
  let user_id: string
  const team_ids: string[] = []

  beforeAll(async () => {
    await prisma.$connect()

    const user = await prisma.user.create({
      data: {
        name: "Admin",
        email: `admin-${Date.now()}@test.com`,
        password: await hash("123456", 10),
        role: "admin",
      },
    })

    user_id = user.id

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password: "123456",
    })

    token = response.body.token
  })

  afterAll(async () => {
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
      await prisma.user.delete({ where: { id: user_id } })
    }

    await prisma.$disconnect()
  })

  it("should create a team", async () => {
    const response = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `Team ${Date.now()}`,
        description: "Test team",
      })

    expect(response.status).toBe(201)
    expect(response.body.name).toContain("Team")

    team_ids.push(response.body.id)
  })

  it("should list teams", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Test team",
      },
    })

    team_ids.push(team.id)

    const response = await request(app)
      .get("/teams")
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("teams")
    expect(Array.isArray(response.body.teams)).toBe(true)
  })

  it("should update a team", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Old description",
      },
    })

    team_ids.push(team.id)

    const response = await request(app)
      .put(`/teams/${team.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Team",
        description: "Updated description",
      })

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(team.id)
    expect(response.body.name).toBe("Updated Team")
    expect(response.body.description).toBe("Updated description")
  })

  it("should delete a team", async () => {
    const team = await prisma.team.create({
      data: {
        name: `Team ${Date.now()}`,
        description: "Test",
      },
    })

    // NÃO adiciona no team_ids porque vamos deletar manualmente
    const response = await request(app)
      .delete(`/teams/${team.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Equipe deletada com sucesso!")

    // valida se realmente foi removido do banco
    const deletedTeam = await prisma.team.findUnique({
      where: { id: team.id },
    })

    expect(deletedTeam).toBeNull()
  })
})
