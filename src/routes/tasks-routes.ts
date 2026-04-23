import { Router } from "express";
import { ensureAuthenticated } from "../middewares/ensure-authenticated";
import { verifyUserAuthorization } from "../middewares/verify-user-authorization";
import { TasksController } from "../controllers/tasks-controllers";
import { TasksStatusController } from "../controllers/tasks-status-controller";
import { TasksPrioritiesController } from "../controllers/task-priorities-controller";

const tasksRoutes = Router();
const tasksController = new TasksController();
const tasksStatusController = new TasksStatusController();
const tasksPrioritiesController = new TasksPrioritiesController();


tasksRoutes.use(ensureAuthenticated);
tasksRoutes.use(verifyUserAuthorization(["admin", "manager"]));

tasksRoutes.post("/", ensureAuthenticated, tasksController.createTask);

tasksRoutes.get("/", ensureAuthenticated, tasksController.getTasks);

tasksRoutes.put("/:id", ensureAuthenticated, tasksController.updateTask);

tasksRoutes.patch("/:id/status", ensureAuthenticated, tasksStatusController.updateTaskStatus);

tasksRoutes.patch("/:id/priority", ensureAuthenticated, tasksPrioritiesController.updateTaskPriority);
tasksRoutes.delete("/:id", ensureAuthenticated, tasksController.deleteTask);

export { tasksRoutes };