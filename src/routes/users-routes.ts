import { Router } from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/users-controller";

const usersRoutes = Router();


usersRoutes.post("/",  createUser);
usersRoutes.get("/",  getUsers);
usersRoutes.put("/:id",  updateUser);
usersRoutes.delete("/:id",  deleteUser);

export { usersRoutes };