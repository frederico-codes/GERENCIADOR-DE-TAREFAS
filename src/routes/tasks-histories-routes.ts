import { Router } from "express";
import { ensureAuthenticated } from "../middewares/ensure-authenticated";
import { verifyUserAuthorization } from "../middewares/verify-user-authorization";
import { TaskHistoriesController } from "../controllers/task-histories-controller";


const tasksHistoriesRoutes = Router();
const tasksHistoriesController = new TaskHistoriesController();

tasksHistoriesRoutes.post("/", ensureAuthenticated,tasksHistoriesController.createTaskHistory);

tasksHistoriesRoutes.get("/:taskId/tasks-histories", ensureAuthenticated, verifyUserAuthorization(["admin"]),tasksHistoriesController.showTaskHistory);

tasksHistoriesRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]),tasksHistoriesController.listAllTaskHistories);

export { tasksHistoriesRoutes };
