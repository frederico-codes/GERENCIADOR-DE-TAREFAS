import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { sign } from "jsonwebtoken";
import { authConfig } from "../configs/auth";
import { prisma } from "../database/prisma";
import { z } from "zod";
import { compare } from "bcryptjs";

const schema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

class SessionsController {
  async create(req: Request, res: Response) {
    try {
      const { email, password } = schema.parse(req.body); 

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

       const passwordMatched = await compare(password, user.password);

      if (!passwordMatched) {
        throw new AppError("Invalid email or password", 401);
      }

      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({ role: user.role },secret, {
        subject: user.id,
        expiresIn: expiresIn,
      });

      const { password: _, ...userWithoutPassword } = user;

      return res.json({ token, user: userWithoutPassword });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export { SessionsController };
