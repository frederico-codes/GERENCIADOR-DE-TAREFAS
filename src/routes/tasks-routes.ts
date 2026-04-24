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

tasksRoutes.post("/", tasksController.createTask);

tasksRoutes.get("/", tasksController.getTasks);

tasksRoutes.put("/:id", tasksController.updateTask);

tasksRoutes.patch("/:id/status", tasksStatusController.updateTaskStatus);

tasksRoutes.patch("/:id/priority", tasksPrioritiesController.updateTaskPriority);
tasksRoutes.delete("/:id", tasksController.deleteTask);

export { tasksRoutes };