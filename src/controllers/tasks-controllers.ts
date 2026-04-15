import { Prisma,TaskPriority, TaskStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";


const createTaskSchema = z.object({
  title: z.string().trim().min(1, "O titulo da tarefa e obrigatorio."),
  description: z.string().trim().min(1, "A descrição da tarefa é obrigatória."),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedTo: z.string().uuid("O ID do usuário atribuído é obrigatório."),
  teamId: z.string().uuid("O ID da equipe é obrigatório."),
});



export class TasksController {
  async createTask(req: Request, res: Response): Promise<void> {
    const { title, description, priority, status, assignedTo, teamId } =
      createTaskSchema.parse(req.body);
  

      if (status === "completed") {
        throw new AppError(
          "Não é possível criar uma tarefa já com status concluído.",
          400,
        );
      }   
    

      if (assignedTo) {
        const user = await prisma.user.findUnique({ where: { id: assignedTo } });
        if (!user) {
          throw new AppError("Usuário não encontrado.", 404);
        }
      }

        const teamMember = await prisma.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: assignedTo,
              teamId,
            },
          },
        });

        if (!teamMember) {
          throw new AppError(
            "O usuário atribuído não pertence a essa equipe.",
            400,
          );
        }


    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          priority,
          status,
          assignedTo,
          teamId,
        },
        include: {
          assignee: {                        //assignee campo obrigatório no insomnia.objeto Usuário completo
            select: {
              name: true,
            },
          },
          team: {
            select: {
              name: true,
            },
          },
        },
      });

      res.status(201).json(newTask);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("Já existe uma tarefa com esses dados.", 409);
      }

      throw error;
    }   
      
  }


  async getTasks(req: Request, res: Response): Promise<void> {
   const querySchema = z.object({
     status: z.nativeEnum(TaskStatus).optional(),
     priority: z.nativeEnum(TaskPriority).optional(),
     userId: z.string().uuid().optional(),
   });
 
   const { status, priority, userId } = querySchema.parse(req.query);
 
   const where: {
     status?: TaskStatus;
     priority?: TaskPriority;
     assignedTo?: string;
   } = {};
 
   if (status) {
     where.status = status;
   }
 
   if (priority) {
     where.priority = priority;
   }
 
  if (req.user.role === "member") {
    where.assignedTo = req.user.id;
  } else if (userId) {
    where.assignedTo = userId;
  }
 
   const tasks = await prisma.task.findMany({ where, 
    include: {
     assignee: {
       select: {
         name: true,
       },
     },
     team: {
       select: {
         name: true,
       },
     },
   }});
 
   res.status(200).json({ tasks });
 }

  async updateTask(req: Request, res: Response): Promise<void> {
    const paramSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      title: z.string().trim().min(1, "O titulo da tarefa e obrigatorio.").optional(),
      description: z.string().trim().min(1, "A descrição da tarefa é obrigatória.").optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    });
    

    const { id } = paramSchema.parse(req.params);
    const { title, description, status, priority } = bodySchema.parse(req.body);
    
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError("Tarefa não encontrada.", 404);
    }

    if (req.user.role === "member" && task.assignedTo !== req.user.id) {
      throw new AppError("Você só pode editar suas próprias tarefas.", 403);
    }
    
    if (status === "completed") {
      throw new AppError(
        "Não é possível atualizar o status para concluído diretamente. Atualize para in_progress primeiro.",
        400,
      );
    }
    
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status, priority },
      include: {
        assignee: {
          select: {
            name: true,
          },
        },
        team: {
          select: {
            name: true,
          },
        },
      },
    });
    
    res.status(200).json(updatedTask);
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError("Tarefa não encontrada.", 404);
    }

    if (req.user.role === "member" && task.assignedTo !== req.user.id) {
      throw new AppError("Você só pode deletar suas próprias tarefas.", 403);
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  }

}
