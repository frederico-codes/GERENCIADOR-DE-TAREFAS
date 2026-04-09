import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";


export function errorHandling(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation Error", issues: err.format() });
  }
  
  return res.status(500).json({ message: "Internal Server Error" });
}
