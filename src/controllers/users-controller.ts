import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { hash} from "bcryptjs";
import { prisma } from "../database/prisma";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres."),
  role: z.enum(["admin", "member"]).optional(),
});


  export async function createUser(req: Request, res: Response) {
    const { name, email, password, role } = createUserSchema.parse(req.body);

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new AppError("User already exists", 400);
    }

    const passwordHash = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  }

  export async function getUsers(req: Request, res: Response) {
    

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    res.status(200).json(users);
  } 

  export async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password, role } = req.body;


    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, password, role },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);
  }

  export async function deleteUser(req: Request, res: Response) {
    const { id } = req.params;
 
    await prisma.user.delete({
      where: { id },
    }); 

    res.status(204).send();
  }





