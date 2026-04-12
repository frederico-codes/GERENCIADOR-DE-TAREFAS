import { Router } from "express";
import { ensureAuthenticated } from "../middewares/ensure-authenticated";
import { verifyUserAuthorization } from "../middewares/verify-user-authorization";
import { TasksController } from "../controllers/tasks-controllers";

const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/", ensureAuthenticated, (req, res) => tasksController.createTask(req, res));

tasksRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), (req, res) => tasksController.getTasks(req, res));

tasksRoutes.put("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), (req, res) => tasksController.updateTask(req, res));

tasksRoutes.patch("/:id/status", ensureAuthenticated, verifyUserAuthorization(["admin"]), (req, res) => tasksController.updateTasksByStatus(req, res));

tasksRoutes.delete("/:id", ensureAuthenticated, verifyUserAuthorization(["admin"]), (req, res) => tasksController.deleteTask(req, res));

tasksRoutes.get("/:id", ensureAuthenticated, (req, res) => tasksController.getTaskById(req, res));

tasksRoutes.get("/user/:userId", ensureAuthenticated, (req, res) => tasksController.getTasksByUserId(req, res));

// tasksRoutes.get("/status/:status", ensureAuthenticated, (req, res) => tasksController.getTasksByStatus(req, res));

export { tasksRoutes };