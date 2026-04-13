import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";



const createTeamMemberSchema = z.object({
  teamId: z.string().uuid(),
  userId: z.string().uuid(),
});

export class TeamMembersController {
  async addTeamMember(req: Request, res: Response): Promise<void> {
    const { teamId, userId } = createTeamMemberSchema.parse(req.body);

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
      include: {
        team: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(teamMember);
  }

  async listTeamMembers(req: Request, res: Response): Promise<void> {
    const teamMembers = await prisma.teamMember.findMany({
      include: {
        team: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(teamMembers);
  }


  async removeTeamMember(req: Request, res: Response): Promise<void> {
    const { teamId, userId } = createTeamMemberSchema.parse(req.body);

    const teamMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {  
          teamId,
          userId,
        },
      },
    });

    if (!teamMember) {
      throw new AppError("Team member not found", 404);
    }

    await prisma.teamMember.delete({
      where: {
        userId_teamId: {
          teamId,
          userId,
        },
      },
    });

    res.status(200).json({ message: "Team member removed successfully" });
  }
}