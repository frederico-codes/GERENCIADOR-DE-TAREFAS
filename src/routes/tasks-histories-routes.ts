import { Router } from "express"
import { ensureAuthenticated } from "../middewares/ensure-authenticated"
import { verifyUserAuthorization } from "../middewares/verify-user-authorization"
import { TaskHistoriesController } from "../controllers/task-histories-controller"
import { tasksRoutes } from "./tasks-routes"

const tasksHistoriesRoutes = Router()
const tasksHistoriesController = new TaskHistoriesController()

tasksRoutes.use(ensureAuthenticated)

tasksHistoriesRoutes.post("/", tasksHistoriesController.createTaskHistory)

tasksHistoriesRoutes.get(
  "/:taskId/tasks-histories",
  verifyUserAuthorization(["admin"]),
  tasksHistoriesController.showTaskHistory,
)

tasksHistoriesRoutes.get(
  "/",
  verifyUserAuthorization(["admin"]),
  tasksHistoriesController.listAllTaskHistories,
)

export { tasksHistoriesRoutes }
