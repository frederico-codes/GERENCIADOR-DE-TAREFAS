import { Request, Response } from "express"
import { z } from "zod"
import { AppError } from "../utils/AppError"
import { prisma } from "../database/prisma"

const updateTeamSchema = z
  .object({
    name: z.string().trim().min(1, "Nome do time e obrigatorio").optional(),
    description: z.string().trim().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Informe ao menos um campo para atualizar",
  })

export async function createTeam(req: Request, res: Response) {
  const { name, description } = req.body

  const existingTeam = await prisma.team.findFirst({
    where: {
      name,
    },
  })

  if (existingTeam) {
    throw new AppError("Já existe uma equipe com esse nome.", 409)
  }

  const team = await prisma.team.create({
    data: {
      name,
      description,
    },
  })

  res.status(201).json(team)
}

export async function getTeams(req: Request, res: Response) {
  const teams = await prisma.team.findMany({})

  res.status(200).json({ teams })
}

export async function updateTeam(req: Request, res: Response) {
  const { id } = req.params

  const team = await prisma.team.findUnique({
    where: { id },
  })

  if (!team) {
    throw new AppError("Equipe não encontrada", 404)
  }

  if (!team.id) {
    throw new AppError("ID da equipe não encontrado", 404)
  }

  if (req.user?.role === "member" && team.id !== req.user.id) {
    throw new AppError("Unauthorized", 403)
  }

  const data = updateTeamSchema.parse(req.body)

  const updatedTeam = await prisma.team.update({
    where: { id },
    data,
  })

  res.status(200).json(updatedTeam)
}

export async function deleteTeam(req: Request, res: Response) {
  const { id } = req.params

  const team = await prisma.team.findUnique({
    where: { id },
  })

  if (!team) {
    throw new AppError("Equipe não encontrada", 404)
  }

  await prisma.team.delete({
    where: { id },
  })

  res.status(200).json({ message: "Equipe deletada com sucesso!" })
}
