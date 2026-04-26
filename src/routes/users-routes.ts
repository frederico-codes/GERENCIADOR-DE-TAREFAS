import { Router } from "express"
import { createUser } from "../controllers/users-controller"

const usersRoutes = Router()

usersRoutes.post("/", createUser)

export { usersRoutes }
