import { Router } from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/users-controller";
import { ensureAuthenticated } from "../middewares/ensure-authenticated";
import { verifyUserAuthorization } from "../middewares/verify-user-authorization";

const usersRoutes = Router();


usersRoutes.post("/",  createUser);
usersRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), getUsers);
usersRoutes.put("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), updateUser);
usersRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), deleteUser);

export { usersRoutes };