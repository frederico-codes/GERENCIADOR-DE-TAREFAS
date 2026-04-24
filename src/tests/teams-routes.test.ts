import request from "supertest"
import { hash } from "bcrypt"
import { app } from "../app"
import { prisma } from "../database/prisma"
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals"

describe("Teams routes", () => {
  let token: string
  let user_id: string
  let team_id: string

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
    if (team_id) {
      await prisma.team.delete({ where: { id: team_id } })
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

    team_id = response.body.id
  })
})