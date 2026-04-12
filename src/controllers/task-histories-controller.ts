import { Request,Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";

const createTaskHistorySchema = z.object({
  taskId: z.string().uuid(),
  new_status: z.enum(["pending", "in_progress", "completed"]),
});

  export class TaskHistoriesController {
    async createTaskHistory(req: Request, res: Response): Promise<void> {
      const { taskId, new_status } = createTaskHistorySchema.parse(req.body);

      const task = await prisma.task.findUnique({ where: { id: taskId } });

      if (!task) {
        throw new AppError("Tarefa não encontrada", 404);
      }

      if (req.user?.role === "member" && task?.assignedTo !== req.user.id) {
        throw new AppError("Unauthorized", 403);
      }

      if (task?.status === "completed") {
        throw new AppError(
          "Não é possível adicionar histórico a uma tarefa concluída",
          400,
        );
      }

      const newTaskHistory = await prisma.taskHistory.create({
        data: {
          taskId,
          newStatus: new_status,
          oldStatus: task.status,
          changedBy: req.user?.id,
        },
      });

      res.status(201).json(newTaskHistory);
    }

    async listTaskHistories(req: Request, res: Response): Promise<void> {
      const taskHistories = await prisma.taskHistory.findMany({   });

      
      res.status(200).json(taskHistories);
    }

    async showTaskHistory(req: Request, res: Response): Promise<void> {
      const { id: taskId } = req.params;

      const task = await prisma.task.findUnique({ where: { id: taskId } });

      if (req.user?.role === "member" && task?.assignedTo !== req.user.id) {
        throw new AppError("the user can only view their deliveries", 403);
      }

      const newTaskHistory = await prisma.taskHistory.findMany({
        where: { taskId },
      });

   
      res.status(200).json(newTaskHistory);
    }
  }
