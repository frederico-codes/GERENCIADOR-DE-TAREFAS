import { Router } from "express";
import { ensureAuthenticated } from "../middewares/ensure-authenticated";
import { verifyUserAuthorization } from "../middewares/verify-user-authorization";
import { TasksController } from "../controllers/tasks-controllers";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin","member"]), tasksController.createTask);

tasksRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), tasksController.getTasks);

tasksRoutes.put("/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), tasksController.updateTask);

tasksRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin", "member"]), tasksController.deleteTask);



export { tasksRoutes };