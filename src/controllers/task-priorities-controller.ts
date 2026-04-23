import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "../database/prisma";
import { z } from "zod";
import { TaskPriority } from "@prisma/client";

const updateTaskPrioritySchema = z.object({
  priority: z.nativeEnum(TaskPriority, {
    errorMap: () => ({ message: "Prioridade inválida. Os valores permitidos são: low, medium, high." }),
  }),
});

export class TasksPrioritiesController {
  async updateTaskPriority(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { priority } = updateTaskPrioritySchema.parse(req.body);

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new AppError("Tarefa não encontrada.", 404);
    }

    const updatedTaskPriority = await prisma.task.update({
      where: { id },
      data: { priority },
    });

    res.status(200).json(updatedTaskPriority);
  }
}