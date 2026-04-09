import { Request, Response } from "express";

class UsersController {
  createUser(req: Request, res: Response) {
    // Lógica para criar um usuário
    res.status(201).json({ message: "Usuário criado com sucesso" });
  }
}


export { UsersController };