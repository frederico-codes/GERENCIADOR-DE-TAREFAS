import { TaskPriority, TaskStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "O titulo da tarefa e obrigatorio."),
  description: z.string().trim().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedTo: z
    .string()
    .uuid()
    .min(1, "O ID do usuário atribuído é obrigatório."),
  teamId: z.string().uuid().optional(),
});

export class TasksController {
  async createTask(req: Request, res: Response): Promise<void> {
    const { title, description, priority, status, assignedTo, teamId } =
      createTaskSchema.parse(req.body);

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        assignedTo: assignedTo ?? req.user.id,
        teamId,
      },
    });

    res.status(201).json(newTask);
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;
    const userRole = req.user.role;

    let where = {};

    const tasks = await prisma.task.findMany({ where });
    res.status(200).json({ tasks });
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]),
    });

    const { id } = paramSchema.parse(req.params);
    const { status } = bodySchema.parse(req.body);

    await prisma.task.findUnique({ where: { id } });

    if(status === "completed"){
      throw new AppError("Não é possível atualizar o status para concluído diretamente. Atualize para in_progress primeiro.", 400);
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });
  

    res.status(200).json(updatedTask);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    res.status(200).json({ task });
  }

  async getTasksByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const tasks = await prisma.task.findMany({
      where: { assignedTo: userId },
    });

    res.status(200).json({ tasks });
  }

  async updateTasksByStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const { status } = z
      .object({ status: z.nativeEnum(TaskStatus) })
      .parse(req.body);

    const task = await prisma.task.findUnique({ where: { id } });

    if (task?.status === "completed") {
      throw new AppError("Não é possível alterar uma tarefa já concluída", 400);
    }
 
    if (status === TaskStatus.pending) {
      throw new AppError("Não é permitido voltar para pending, pois a tarefa já foi encerrada", 400);
    }

     if (status === TaskStatus.in_progress) {
      throw new AppError("Não é permitido voltar para in_progress, pois a tarefa já foi encerrada", 400);
    }

    if (!task) {
      throw new AppError("Tarefa não encontrada", 404);
    }
    


    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(updatedTask);
  }
}
