import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError"
import { verify } from "jsonwebtoken"
import { authConfig } from "../configs/auth"

interface ITokenPayload {
  sub: string
  role: string
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401)
  }

  const [, token] = authHeader.split(" ")

  const { sub: user_id, role } = verify(
    token,
    authConfig.jwt.secret,
  ) as ITokenPayload

  req.user = {
    id: String(user_id),
    role,
  }

  return next()
}
