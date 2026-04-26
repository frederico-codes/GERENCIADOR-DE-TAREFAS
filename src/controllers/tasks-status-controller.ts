import { Request, Response } from "express"
import { AppError } from "../utils/AppError"
import { prisma } from "../database/prisma"
import { z } from "zod"
import { TaskStatus } from "@prisma/client"

const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({
      message:
        "Status inválido. Os valores permitidos são: pending, in_progress, completed.",
    }),
  }),
})

export class TasksStatusController {
  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)
    const { status } = updateTaskStatusSchema.parse(req.body)

    const newTask = await prisma.task.findUnique({ where: { id } })

    if (!newTask) {
      throw new AppError("Tarefa não encontrada.", 404)
    }

    if (newTask.status === status) {
      throw new AppError("A tarefa já está com esse status.", 400)
    }

    if (newTask.status === "pending" && status === "completed") {
      throw new AppError(
        "Não é possível alterar o status de pending para completed diretamente. Primeiro altere para in_progress.",
        400,
      )
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    })

    await prisma.taskHistory.create({
      data: {
        taskId: newTask.id,
        changedBy: req.user.id,
        oldStatus: newTask.status,
        newStatus: updatedTask.status,
      },
    })

    res.status(200).json(updatedTask)
  }
}
