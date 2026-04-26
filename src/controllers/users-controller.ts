import { Request, Response } from "express"
import { AppError } from "../utils/AppError"
import { hash } from "bcrypt"
import { prisma } from "../database/prisma"
import { z } from "zod"

const createUserSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres."),
  role: z.enum(["admin", "member"]).optional(),
})

export async function createUser(req: Request, res: Response) {
  const { name, email, password, role } = createUserSchema.parse(req.body)

  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userAlreadyExists) {
    throw new AppError("User with same email already exists", 400)
  }

  const passwordHash = await hash(password, 10)

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      ...(role && { role }),
    },
  })

  const { password: _password, ...userWithoutPassword } = newUser

  res.status(201).json(userWithoutPassword)
}
