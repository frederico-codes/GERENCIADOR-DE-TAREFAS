import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";

const updateTeamSchema = z
  .object({
    name: z.string().trim().min(1, "Nome do time e obrigatorio").optional(),
    description: z.string().trim().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Informe ao menos um campo para atualizar",
  });

export async function createTeam(req: Request, res: Response) {
  const { name, description } = req.body;

  const team = await prisma.team.create({
    data: {
      name,
      description,
    },
  });

  res.status(201).json(team);
}

export async function getTeams(req: Request, res: Response) {
  const teams = await prisma.team.findMany({});

  // Lógica para obter todas as equipes
  res.status(200).json({ teams });
}

export async function updateTeam(req: Request, res: Response) {
  const { id } = req.params;

  const data = updateTeamSchema.parse(req.body);

  const team = await prisma.team.findUnique({
    where: { id },
  });

  if (!team) {
    throw new AppError("Equipe não encontrada", 404);
  }

  const updatedTeam = await prisma.team.update({
    where: { id },
    data,
  });
  // Lógica para atualizar uma equipe existente
  res.status(200).json(updatedTeam);
}

export async function deleteTeam(req: Request, res: Response) {
  // Lógica para deletar uma equipe existente
  res.status(200).json({ message: "Equipe deletada com sucesso!" });
}

export async function getTeamById(req: Request, res: Response) {
  // Lógica para obter uma equipe específica por ID
  res.status(200).json({ team: null });
}

export async function getTeamsByUserId(req: Request, res: Response) {
  // Lógica para obter todas as equipes de um usuário específico por ID
  res.status(200).json({ teams: [] });
}

export async function getTeamsByStatus(req: Request, res: Response) {
  // Lógica para obter todas as equipes com um status específico
  res.status(200).json({ teams: [] });
}
